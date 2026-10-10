# NETRA V1

NETRA is being connected to its existing frontend in phases. The current foundation uses a Fastify modular monolith, PostgreSQL, Drizzle migrations, and Better Auth. The existing screens remain under `outputs/` and are served by the API.

## Local isolated sandbox

The sandbox starts the real app against an in-memory PostgreSQL-compatible PGlite database and temporary local media storage. It applies the same Drizzle migrations and sends verification/reset messages through SMTP configured in `.env`. Sandbox data is deleted when the process stops. Email actions return a clear error when SMTP is not configured or delivery fails; they do not claim that a terminal-only link was emailed.

```sh
pnpm install
pnpm dev:sandbox
```

Set `EMAIL_FROM`, `SMTP_HOST`, and `SMTP_PORT` in `.env` (and `SMTP_USER` / `SMTP_PASSWORD` if your provider requires them), then run the sandbox and open [http://127.0.0.1:4173](http://127.0.0.1:4173). This path exercises the actual frontend, SMTP delivery, auth handlers, session cookies, profile activation, and API against an isolated database.

## PostgreSQL development or deployment

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to a PostgreSQL database dedicated to this environment.
2. Generate a unique auth secret, for example `openssl rand -base64 48`, and set `BETTER_AUTH_SECRET`.
3. Apply the checked-in migrations with `pnpm db:migrate`.
4. Start with `pnpm dev` or build and run with `pnpm build && pnpm start`.

Set `APP_URL` to the exact browser origin. Production requires HTTPS and `EMAIL_MODE=smtp`, plus `EMAIL_FROM`, `SMTP_HOST`, and `SMTP_PORT`; configure `SMTP_USER` and `SMTP_PASSWORD` if the provider requires authentication. Keep separate databases and secrets for development, test, and production. Never point the sandbox at production data.

Useful commands:

```sh
pnpm typecheck
pnpm test
pnpm db:generate
pnpm db:migrate
```

## Implemented foundation and media

The current foundation includes one account per person, email verification, password reset, HTTP-only server sessions, profile memberships, server-validated profile switching, consumer preferences, persistent onboarding progress, business verification requests, and validated media upload intents. Profile photos uploaded during onboarding are stored as media assets and attached to the signed-in account. Media bytes are stored outside PostgreSQL. Image/video type, extension, declared size, actual size, and file signature are checked before an asset is marked ready.

Local development uses a private filesystem adapter. Production startup requires S3-compatible storage (`MEDIA_STORAGE_MODE=s3`). Configure an endpoint, region, bucket, credentials, and optional public CDN base URL. If the bucket serves presigned uploads from a different origin, configure its CORS policy to allow the NETRA `APP_URL`, `PUT`, and the `Content-Type` request header. Avoid committing storage credentials. Private media downloads are owner-checked and use short-lived signed reads; public profile photos may use the configured CDN base URL.

Advertiser selection maps to the Brand/Business context; there is no Advertiser account type. Product/content publishing, feeds, social interactions, messaging, analytics, CFund and payment behavior remain to be implemented in their planned phases. A real PostgreSQL database and a working email provider are still needed for durable private testing; the sandbox uses an in-memory database and does not send real email.
