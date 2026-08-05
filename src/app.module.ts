import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { InvitationsModule } from './invitations/invitations.module';
import { ImportModule } from './import/import.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/heatmap',
    ),

    // Email service
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: `"Heatmap App" <${process.env.EMAIL_USER}>`,
      },
      template: {
        dir:
          process.env.NODE_ENV === 'production'
            ? join(__dirname, 'templates') // dist/templates
            : join(process.cwd(), 'src', 'templates'), // src/templates
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    // Application modules
    AuthModule,
    UsersModule,
    ReportsModule,
    InvitationsModule,
    ImportModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
