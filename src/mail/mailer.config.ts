import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { existsSync } from 'fs';
import { join } from 'path';

export function resolveTemplateDir(): string {
  const candidates = [
    join(__dirname, '..', 'templates'),
    join(process.cwd(), 'dist', 'templates'),
    join(process.cwd(), 'src', 'templates'),
  ];

  for (const dir of candidates) {
    if (existsSync(dir)) {
      return dir;
    }
  }

  return join(__dirname, '..', 'templates');
}

export const mailerFactory = (config: ConfigService) => {
  const port = Number(config.get<string>('EMAIL_PORT') ?? '587');
  const secure =
    config.get<string>('EMAIL_SECURE') === 'true' || port === 465;
  const user = config.get<string>('EMAIL_USER');
  const from =
    config.get<string>('EMAIL_FROM') ||
    (user ? `"Heatmap App" <${user}>` : undefined);

  return {
    transport: {
      host: config.get<string>('EMAIL_HOST'),
      port,
      secure,
      requireTLS: !secure && port === 587,
      auth: {
        user,
        pass: config.get<string>('EMAIL_PASS'),
      },
    },
    defaults: {
      from,
    },
    template: {
      dir: resolveTemplateDir(),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
