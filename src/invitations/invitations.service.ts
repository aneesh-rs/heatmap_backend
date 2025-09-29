import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation, InvitationDocument } from '../schemas/invitation.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation.name)
    private invitationModel: Model<InvitationDocument>,
  ) {}

  async createInvitation(
    inviterId: string,
    role: 'Admin' | 'User',
    reservedEmail?: string,
  ) {
    const invitationId = uuidv4();
    const invite = new this.invitationModel({
      id: invitationId,
      inviterId,
      role,
      reservedEmail,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    await invite.save();
    return invite;
  }

  async getInvitation(invitationId: string) {
    const invite = await this.invitationModel
      .findOne({ id: invitationId })
      .exec();
    if (!invite) {
      throw new NotFoundException('Invitation not found');
    }
    return invite;
  }

  async markVerificationSent(invitationId: string) {
    const result = await this.invitationModel
      .findOneAndUpdate(
        { id: invitationId },
        { status: 'verification_sent', updatedAt: new Date() },
        { new: true },
      )
      .exec();
    if (!result) {
      throw new NotFoundException('Invitation not found');
    }
    return result;
  }

  async acceptInvitation(
    invitationId: string,
    acceptedByUserId: string,
    emailUsed: string,
  ) {
    const invite = await this.getInvitation(invitationId);
    if (invite.status === 'accepted') {
      throw new BadRequestException('Invitation already accepted');
    }
    if (
      invite.reservedEmail &&
      invite.reservedEmail.toLowerCase() !== emailUsed.toLowerCase()
    ) {
      throw new BadRequestException('Invitation email mismatch');
    }
    invite.status = 'accepted';
    invite.acceptedBy = acceptedByUserId;
    invite.updatedAt = new Date();
    await invite.save();
    return invite;
  }
}
