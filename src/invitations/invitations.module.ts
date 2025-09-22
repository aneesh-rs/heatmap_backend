import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from '../schemas/invitation.schema';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
