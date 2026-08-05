import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Create invitation link' })
  async createInvitation(@Body() body: CreateInvitationDto) {
    const invite = await this.invitationsService.createInvitation(
      body.inviterId,
      body.role,
      body.reservedEmail,
    );
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:5173';
    const invitationLink = `${frontendUrl}/signup?invitationId=${invite.id}`;
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Accept invitation (manual endpoint if needed)' })
  async accept(@Body() body: AcceptInvitationDto, @Request() req) {
    return this.invitationsService.acceptInvitation(
      body.invitationId,
      req.user.id,
      req.user.email,
    );
  }
}
