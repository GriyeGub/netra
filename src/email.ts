import nodemailer from "nodemailer";
import type { AppConfig } from "./config.js";

export interface AuthEmail {
  to: string;
  subject: string;
  url: string;
  text: string;
}

export function createAuthEmailSender(config: AppConfig) {
  const transport = config.emailMode === "smtp"
    ? nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465,
        auth: config.smtpUser && config.smtpPassword
          ? { user: config.smtpUser, pass: config.smtpPassword }
          : undefined,
      })
    : undefined;

  return async function sendAuthEmail(message: AuthEmail): Promise<void> {
    if (config.emailMode === "console") {
      // Development-only: links are intentionally visible only in the local server terminal.
      console.info(`[NETRA development email] To: ${message.to}\nSubject: ${message.subject}\n${message.text}\nURL: ${message.url}`);
      return;
    }

    if (!config.smtpHost || !config.smtpPort || !config.emailFrom) {
      throw new Error("Email delivery is unavailable. Configure EMAIL_FROM, SMTP_HOST, and SMTP_PORT.");
    }
    if (!transport) throw new Error("SMTP email transport is not configured.");
    await transport.sendMail({
      from: config.emailFrom,
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
  };
}
