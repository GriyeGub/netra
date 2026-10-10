import "dotenv/config";

export type EmailMode = "console" | "smtp";
export type MediaStorageMode = "local" | "s3";

export interface AppConfig {
  nodeEnv: "development" | "test" | "production";
  host: string;
  port: number;
  appUrl: string;
  databaseUrl: string;
  authSecret: string;
  emailMode: EmailMode;
  emailFrom?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  mediaStorageMode: MediaStorageMode;
  mediaStorageRoot: string;
  mediaMaxBytes: number;
  s3Endpoint?: string;
  s3Region?: string;
  s3Bucket?: string;
  s3AccessKeyId?: string;
  s3SecretAccessKey?: string;
  s3PublicBaseUrl?: string;
  s3ForcePathStyle: boolean;
  mediaAdminUserIds: string[];
}

export function readConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const nodeEnv = env.NODE_ENV ?? "development";
  if (nodeEnv !== "development" && nodeEnv !== "test" && nodeEnv !== "production") {
    throw new Error("NODE_ENV must be development, test, or production.");
  }

  const port = Number(env.PORT ?? 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port.");
  }

  const appUrl = env.APP_URL ?? `http://127.0.0.1:${port}`;
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(appUrl);
  } catch {
    throw new Error("APP_URL must be an absolute URL.");
  }
  if (parsedUrl.protocol !== "https:" && !(nodeEnv !== "production" && parsedUrl.protocol === "http:")) {
    throw new Error("APP_URL must use HTTPS in production.");
  }

  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is required. Copy .env.example and configure PostgreSQL.");

  const authSecret = env.BETTER_AUTH_SECRET;
  if (!authSecret || authSecret.length < 32 || authSecret.includes("replace-with")) {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 characters of random secret material.");
  }

  const emailMode = (env.EMAIL_MODE ?? (nodeEnv === "production" ? "smtp" : "console")) as EmailMode;
  if (emailMode !== "console" && emailMode !== "smtp") throw new Error("EMAIL_MODE must be console or smtp.");
  if (nodeEnv === "production" && emailMode !== "smtp") {
    throw new Error("Production requires EMAIL_MODE=smtp; console email is development-only.");
  }

  const mediaStorageMode = (env.MEDIA_STORAGE_MODE ?? (nodeEnv === "production" ? "s3" : "local")) as MediaStorageMode;
  if (mediaStorageMode !== "local" && mediaStorageMode !== "s3") throw new Error("MEDIA_STORAGE_MODE must be local or s3.");
  if (nodeEnv === "production" && mediaStorageMode !== "s3") throw new Error("Production requires S3-compatible media storage.");
  const mediaMaxBytes = Number(env.MEDIA_MAX_BYTES ?? 524288000);
  if (!Number.isSafeInteger(mediaMaxBytes) || mediaMaxBytes < 1 || mediaMaxBytes > 2_147_483_647) {
    throw new Error("MEDIA_MAX_BYTES must be an integer between 1 and 2147483647.");
  }
  if (mediaStorageMode === "s3" && (!env.S3_ENDPOINT || !env.S3_REGION || !env.S3_BUCKET || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY)) {
    throw new Error("S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY are required for S3 media storage.");
  }
  if (mediaStorageMode === "s3") {
    try {
      const endpoint = new URL(env.S3_ENDPOINT!);
      if (endpoint.protocol !== "https:" && nodeEnv === "production") throw new Error();
    } catch {
      throw new Error("S3_ENDPOINT must be an absolute URL (HTTPS in production).");
    }
  }

  const smtpPort = env.SMTP_PORT ? Number(env.SMTP_PORT) : undefined;
  if (emailMode === "smtp" && (!env.SMTP_HOST || !smtpPort || !env.EMAIL_FROM)) {
    throw new Error("SMTP_HOST, SMTP_PORT, and EMAIL_FROM are required when EMAIL_MODE=smtp.");
  }

  return {
    nodeEnv,
    host: env.HOST ?? "127.0.0.1",
    port,
    appUrl: parsedUrl.origin,
    databaseUrl,
    authSecret,
    emailMode,
    emailFrom: env.EMAIL_FROM,
    smtpHost: env.SMTP_HOST,
    smtpPort,
    smtpUser: env.SMTP_USER,
    smtpPassword: env.SMTP_PASSWORD,
    mediaStorageMode,
    mediaStorageRoot: env.MEDIA_STORAGE_ROOT ?? "./data/media",
    mediaMaxBytes,
    s3Endpoint: env.S3_ENDPOINT,
    s3Region: env.S3_REGION,
    s3Bucket: env.S3_BUCKET,
    s3AccessKeyId: env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: env.S3_SECRET_ACCESS_KEY,
    s3PublicBaseUrl: env.S3_PUBLIC_BASE_URL,
    s3ForcePathStyle: env.S3_FORCE_PATH_STYLE === "true",
    mediaAdminUserIds: (env.NETRA_ADMIN_USER_IDS ?? "").split(",").map((value) => value.trim()).filter(Boolean),
  };
}
