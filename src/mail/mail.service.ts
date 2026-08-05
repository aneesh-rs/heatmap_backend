import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { getTestMessageUrl } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  private isProduction(): boolean {
    return (
      process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
    );
  }

  private assertConfigured(): void {
    const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env;
    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
      throw new ServiceUnavailableException(
        'Email is not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS.',
      );
    }
  }

  private assertDeliverable(): void {
    const host = process.env.EMAIL_HOST ?? '';
    if (this.isProduction() && host.includes('ethereal.email')) {
      throw new ServiceUnavailableException(
        'Email uses Ethereal SMTP in production. Ethereal never delivers to real inboxes (yopmail, Gmail). Set EMAIL_HOST/USER/PASS to Brevo, Gmail App Password, or another real SMTP provider on Vercel.',
      );
    }
  }

  async send(options: ISendMailOptions) {
    this.assertConfigured();
    this.assertDeliverable();

    if (process.env.EMAIL_HOST?.includes('ethereal.email')) {
      this.logger.warn(
        'EMAIL_HOST is Ethereal — messages stay in Ethereal inbox only, not real addresses like yopmail.',
      );
    }

    try {
      const info = await this.mailerService.sendMail(options);

      if (process.env.EMAIL_HOST?.includes('ethereal.email')) {
        const preview = getTestMessageUrl(info);
        if (preview) {
          this.logger.log(`Ethereal preview URL: ${preview}`);
        }
      } else {
        this.logger.log(
          `Email sent to ${options.to} (messageId=${info.messageId ?? 'n/a'})`,
        );
      }

      return info;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown mailer error';
      this.logger.error(`Failed to send email to ${options.to}: ${message}`);
      throw error;
    }
  }
}
