import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstSurname: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  secondSurname?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  birthday: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  invitationId?: string;
}
