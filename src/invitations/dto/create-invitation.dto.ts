import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty()
  @IsString()
  inviterId: string;

  @ApiProperty({ enum: ['Admin', 'User'] })
  @IsString()
  @IsIn(['Admin', 'User'])
  role: 'Admin' | 'User';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  reservedEmail?: string;
}
