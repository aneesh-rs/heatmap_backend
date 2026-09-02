import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { InvitationsModule } from './invitations/invitations.module';
import { ImportModule } from './import/import.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGODB_URI?.trim();
        if (!uri) {
          return {
            uri: 'mongodb://localhost:27017/heatmap',
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
          };
        }

        return {
          uri,
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
        };
      },
    }),

    MailModule,
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
