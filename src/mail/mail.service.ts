import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { gmail_v1, google } from 'googleapis';
import { renderTemplate } from './template.util';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, unknown>;
  html?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly oauth2Client: OAuth2Client;
  private readonly gmail: gmail_v1.Gmail;

  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    this.oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  private assertConfigured(): void {
    const required = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GMAIL_REFRESH_TOKEN',
      'GMAIL_SENDER',
    ] as const;

    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new ServiceUnavailableException(
        `Gmail API not configured. Set ${missing.join(', ')}.`,
      );
    }
  }

  private getFrom(): string {
    return (
      process.env.EMAIL_FROM ||
      `"Heatmap App" <${process.env.GMAIL_SENDER}>`
    );
  }

  private encodeSubject(subject: string): string {
    return `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
  }

  private encodeRawMessage(raw: string): string {
    return Buffer.from(raw)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private buildRawMessage(
    to: string | string[],
    subject: string,
    html: string,
  ): string {
    const toHeader = Array.isArray(to) ? to.join(', ') : to;

    return [
      `From: ${this.getFrom()}`,
      `To: ${toHeader}`,
      `Subject: ${this.encodeSubject(subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      html,
    ].join('\r\n');
  }

  async send(options: SendMailOptions) {
    this.assertConfigured();

    const html =
      options.html ??
      (options.template
        ? await renderTemplate(options.template, options.context ?? {})
        : undefined);

    if (!html) {
      throw new ServiceUnavailableException(
        'Email body missing. Provide html or template.',
      );
    }

    try {
      const raw = this.buildRawMessage(options.to, options.subject, html);
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: this.encodeRawMessage(raw),
        },
      });

      this.logger.log(
        `Email sent to ${options.to} (gmailId=${response.data.id ?? 'n/a'})`,
      );

      return response.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown Gmail API error';
      this.logger.error(`Failed to send email to ${options.to}: ${message}`);
      throw new ServiceUnavailableException(
        `Failed to send email via Gmail API: ${message}`,
      );
    }
  }
}
