import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty()
  @IsString()
  invitationId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  email: string;
}
