import { createHmac, createHash, timingSafeEqual, randomUUID } from "node:crypto";
import { createReadStream, createWriteStream, type ReadStream } from "node:fs";
import { mkdir, open, rename, rm, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { Transform, type Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { AppConfig } from "./config.js";

export interface StoredObjectInspection {
  byteSize: number;
  contentType: string;
  prefix: Buffer;
}

export interface MediaStorage {
  readonly provider: "local" | "s3";
  createUploadUrl(assetId: string, objectKey: string, contentType: string, expiresAt: Date): Promise<string>;
  storeLocalUpload?(objectKey: string, body: Readable, maxBytes: number): Promise<StoredObjectInspection>;
  inspect(objectKey: string): Promise<StoredObjectInspection | null>;
  createReadUrl(objectKey: string, expiresAt: Date, publicAccess?: boolean): Promise<string>;
  openLocalObject?(objectKey: string): ReadStream;
  deleteObject(objectKey: string): Promise<void>;
  publicUrl(objectKey: string, assetId: string): string;
  localSignatureValid?(assetId: string, expiresAt: number, signature: string): boolean;
}

const sha256 = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const hmac = (key: string | Buffer, value: string) => createHmac("sha256", key).update(value).digest();
const awsEncode = (value: string) => encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
const utcStamp = (value: Date) => value.toISOString().replace(/[:-]|.d{3}/g, "");

class LocalMediaStorage implements MediaStorage {
  readonly provider = "local" as const;
  private readonly root: string;
  constructor(root: string, private readonly appUrl: string, private readonly secret: string) {
    this.root = resolve(root);
  }

  async createUploadUrl(assetId: string, _objectKey: string, _contentType: string, expiresAt: Date): Promise<string> {
    const expiry = Math.floor(expiresAt.getTime() / 1000);
    const signature = createHmac("sha256", this.secret).update(`${assetId}:${expiry}`).digest("hex");
    const url = new URL(`/api/v1/media/local/${assetId}`, this.appUrl);
    url.searchParams.set("expires", String(expiry));
    url.searchParams.set("signature", signature);
    return url.toString();
  }

  localSignatureValid(assetId: string, expiresAt: number, signature: string): boolean {
    const expected = createHmac("sha256", this.secret).update(`${assetId}:${expiresAt}`).digest();
    let supplied: Buffer;
    try { supplied = Buffer.from(signature, "hex"); } catch { return false; }
    return supplied.length === expected.length && timingSafeEqual(expected, supplied);
  }

  async storeLocalUpload(objectKey: string, body: Readable, maxBytes: number): Promise<StoredObjectInspection> {
    const target = this.objectPath(objectKey);
    await mkdir(dirname(target), { recursive: true });
    const temp = `${target}.${randomUUID()}.upload`;
    let byteSize = 0;
    const chunks: Buffer[] = [];
    let prefixSize = 0;
    const meter = new Transform({
      transform(chunk: Buffer | string, _encoding, callback) {
        const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        byteSize += bytes.byteLength;
        if (byteSize > maxBytes) return callback(Object.assign(new Error("Uploaded file exceeds its permitted size."), { statusCode: 413 }));
        if (prefixSize < 32) {
          const prefixPart = bytes.subarray(0, 32 - prefixSize);
          chunks.push(prefixPart);
          prefixSize += prefixPart.byteLength;
        }
        callback(null, bytes);
      },
    });
    try {
      await pipeline(body, meter, createWriteStream(temp, { flags: "wx", mode: 0o600 }));
      if (!byteSize) throw Object.assign(new Error("The uploaded file is empty."), { statusCode: 400 });
      await rename(temp, target);
      return { byteSize, contentType: "", prefix: Buffer.concat(chunks).subarray(0, 32) };
    } catch (error) {
      await rm(temp, { force: true });
      throw error;
    }
  }

  async inspect(objectKey: string): Promise<StoredObjectInspection | null> {
    const path = this.objectPath(objectKey);
    try {
      const info = await stat(path);
      const file = await open(path, "r");
      try {
        const prefix = Buffer.alloc(Math.min(32, info.size));
        await file.read(prefix, 0, prefix.byteLength, 0);
        return { byteSize: info.size, contentType: "", prefix };
      } finally { await file.close(); }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async createReadUrl(_objectKey: string, _expiresAt: Date, _publicAccess = false): Promise<string> {
    return "";
  }

  openLocalObject(objectKey: string): ReadStream {
    return createReadStream(this.objectPath(objectKey));
  }

  async deleteObject(objectKey: string): Promise<void> {
    await rm(this.objectPath(objectKey), { force: true });
  }

  publicUrl(_objectKey: string, assetId: string): string {
    return new URL(`/api/v1/media/${assetId}/content`, this.appUrl).toString();
  }

  private objectPath(objectKey: string): string {
    const path = resolve(join(this.root, objectKey));
    if (!path.startsWith(`${this.root}/`)) throw new Error("Invalid media object key.");
    return path;
  }
}

class S3MediaStorage implements MediaStorage {
  readonly provider = "s3" as const;
  private readonly endpoint: URL;
  constructor(private readonly config: AppConfig) {
    this.endpoint = new URL(config.s3Endpoint!);
  }

  async createUploadUrl(_assetId: string, objectKey: string, contentType: string, expiresAt: Date): Promise<string> {
    const url = this.objectUrl(objectKey);
    const now = new Date();
    const dateStamp = utcStamp(now).slice(0, 8);
    const amzDate = utcStamp(now);
    const scope = `${dateStamp}/${this.config.s3Region}/s3/aws4_request`;
    const expires = Math.max(1, Math.min(600, Math.floor((expiresAt.getTime() - now.getTime()) / 1000)));
    const query: Record<string, string> = {
      "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
      "X-Amz-Credential": `${this.config.s3AccessKeyId}/${scope}`,
      "X-Amz-Date": amzDate,
      "X-Amz-Expires": String(expires),
      "X-Amz-SignedHeaders": "content-type;host",
    };
    const canonicalQuery = Object.entries(query).map(([key, value]) => [awsEncode(key), awsEncode(value)] as const)
      .sort(([ak, av], [bk, bv]) => ak.localeCompare(bk) || av.localeCompare(bv))
      .map(([key, value]) => `${key}=${value}`).join("&");
    const canonicalRequest = ["PUT", url.pathname, canonicalQuery, `content-type:${contentType}\nhost:${url.host}\n`, "content-type;host", "UNSIGNED-PAYLOAD"].join("\n");
    const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
    query["X-Amz-Signature"] = this.sign(dateStamp, stringToSign);
    url.search = Object.entries(query).map(([key, value]) => `${awsEncode(key)}=${awsEncode(value)}`)
      .sort().join("&");
    return url.toString();
  }

  async inspect(objectKey: string): Promise<StoredObjectInspection | null> {
    const url = this.objectUrl(objectKey);
    const head = await this.signedRequest(url, "HEAD");
    if (head.status === 404 || head.status === 403) return null;
    if (!head.ok) throw new Error(`Object storage HEAD failed with ${head.status}.`);
    const byteSize = Number(head.headers.get("content-length"));
    if (!Number.isSafeInteger(byteSize) || byteSize < 0) throw new Error("Object storage returned an invalid Content-Length.");
    const contentType = (head.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const ranged = await this.signedRequest(url, "GET", { Range: "bytes=0-31" });
    if (!ranged.ok && ranged.status !== 206) throw new Error(`Object storage range read failed with ${ranged.status}.`);
    return { byteSize, contentType, prefix: Buffer.from(await ranged.arrayBuffer()).subarray(0, 32) };
  }

  async createReadUrl(objectKey: string, expiresAt: Date, publicAccess = false): Promise<string> {
    if (publicAccess && this.config.s3PublicBaseUrl) {
      return new URL(objectKey.split("/").map(awsEncode).join("/"), this.config.s3PublicBaseUrl.endsWith("/") ? this.config.s3PublicBaseUrl : `${this.config.s3PublicBaseUrl}/`).toString();
    }
    const url = this.objectUrl(objectKey);
    const now = new Date();
    const dateStamp = utcStamp(now).slice(0, 8);
    const amzDate = utcStamp(now);
    const scope = `${dateStamp}/${this.config.s3Region}/s3/aws4_request`;
    const query: Record<string, string> = {
      "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
      "X-Amz-Credential": `${this.config.s3AccessKeyId}/${scope}`,
      "X-Amz-Date": amzDate,
      "X-Amz-Expires": String(Math.max(1, Math.min(900, Math.floor((expiresAt.getTime() - now.getTime()) / 1000)))),
      "X-Amz-SignedHeaders": "host",
    };
    const canonicalQuery = Object.entries(query).map(([key, value]) => [awsEncode(key), awsEncode(value)] as const)
      .sort(([ak, av], [bk, bv]) => ak.localeCompare(bk) || av.localeCompare(bv))
      .map(([key, value]) => `${key}=${value}`).join("&");
    const canonicalRequest = ["GET", url.pathname, canonicalQuery, `host:${url.host}\n`, "host", "UNSIGNED-PAYLOAD"].join("\n");
    const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
    query["X-Amz-Signature"] = this.sign(dateStamp, stringToSign);
    url.search = Object.entries(query).map(([key, value]) => `${awsEncode(key)}=${awsEncode(value)}`).sort().join("&");
    return url.toString();
  }

  async deleteObject(objectKey: string): Promise<void> {
    const response = await this.signedRequest(this.objectUrl(objectKey), "DELETE");
    if (!response.ok && response.status !== 404) throw new Error(`Object storage DELETE failed with ${response.status}.`);
  }

  publicUrl(objectKey: string, assetId: string): string {
    if (this.config.s3PublicBaseUrl) return new URL(objectKey.split("/").map(awsEncode).join("/"), this.config.s3PublicBaseUrl.endsWith("/") ? this.config.s3PublicBaseUrl : `${this.config.s3PublicBaseUrl}/`).toString();
    return new URL(`/api/v1/media/${assetId}/content`, this.config.appUrl).toString();
  }

  private objectUrl(objectKey: string): URL {
    const url = new URL(this.endpoint);
    const encodedKey = objectKey.split("/").map(awsEncode).join("/");
    if (this.config.s3ForcePathStyle) url.pathname = `${url.pathname.replace(/\/$/, "")}/${awsEncode(this.config.s3Bucket!)}/${encodedKey}`;
    else {
      url.hostname = `${this.config.s3Bucket}.${url.hostname}`;
      url.pathname = `${url.pathname.replace(/\/$/, "")}/${encodedKey}`;
    }
    return url;
  }

  private async signedRequest(url: URL, method: "HEAD" | "GET" | "DELETE", additional: Record<string, string> = {}): Promise<Response> {
    const now = new Date();
    const amzDate = utcStamp(now);
    const dateStamp = amzDate.slice(0, 8);
    const payloadHash = sha256("");
    const headers: Record<string, string> = { host: url.host, "x-amz-content-sha256": payloadHash, "x-amz-date": amzDate, ...additional };
    const normalizedHeaders = Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
    const names = Object.keys(normalizedHeaders).sort();
    const canonicalHeaders = names.map((key) => `${key}:${normalizedHeaders[key]!.trim().replace(/\s+/g, " ")}\n`).join("");
    const canonicalRequest = [method, url.pathname, "", canonicalHeaders, names.join(";"), payloadHash].join("\n");
    const scope = `${dateStamp}/${this.config.s3Region}/s3/aws4_request`;
    const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
    const authorization = `AWS4-HMAC-SHA256 Credential=${this.config.s3AccessKeyId}/${scope}, SignedHeaders=${names.join(";")}, Signature=${this.sign(dateStamp, stringToSign)}`;
    const requestHeaders = new Headers(headers);
    requestHeaders.set("Authorization", authorization);
    return fetch(url, { method, headers: requestHeaders });
  }

  private sign(dateStamp: string, stringToSign: string): string {
    const dateKey = hmac(`AWS4${this.config.s3SecretAccessKey}`, dateStamp);
    const regionKey = hmac(dateKey, this.config.s3Region!);
    const serviceKey = hmac(regionKey, "s3");
    const signingKey = hmac(serviceKey, "aws4_request");
    return createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  }
}

export function createMediaStorage(config: AppConfig): MediaStorage {
  return config.mediaStorageMode === "s3"
    ? new S3MediaStorage(config)
    : new LocalMediaStorage(config.mediaStorageRoot, config.appUrl, config.authSecret);
}
