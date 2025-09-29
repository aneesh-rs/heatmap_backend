import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from 'src/invitations/dto/create-invitation.dto';
import { AcceptInvitationDto } from 'src/invitations/dto/accept-invitation.dto';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create invitation link' })
  async createInvitation(@Body() body: CreateInvitationDto) {
    const invite = await this.invitationsService.createInvitation(
      body.inviterId,
      body.role,
      body.reservedEmail,
    );
    const invitationLink = `${process.env.FRONTEND_URL}/signup?invitationId=${invite.id}`;
    return {
      invitationId: invite.id,
      invitationLink,
      invite,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invitation by id' })
  async getInvitation(@Param('id') id: string) {
    return this.invitationsService.getInvitation(id);
  }

  @Post('accept')
  @ApiOperation({ summary: 'Accept invitation (manual endpoint if needed)' })
  async accept(@Body() body: AcceptInvitationDto) {
    return this.invitationsService.acceptInvitation(
      body.invitationId,
      body.userId,
      body.email,
    );
  }
}
