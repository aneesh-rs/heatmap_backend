import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SocialLoginDto {
  @ApiProperty()
  @IsString()
  idToken: string;
}
