import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
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
  name: string;

  @ApiProperty()
  @IsString()
  firstSurname: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  secondSurname?: string;

  @ApiProperty()
  @IsString()
  birthday: string;
}
