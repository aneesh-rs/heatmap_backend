import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 attempts per 5 minutes
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User created, verification email sent',
  })
  @ApiResponse({ status: 400, description: 'User already exists' })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Google OAuth' })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async googleLogin(@Body() socialLoginDto: SocialLoginDto) {
    return this.authService.googleLogin(socialLoginDto);
  }

  @Post('facebook-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Facebook OAuth' })
  @ApiResponse({ status: 200, description: 'Facebook login successful' })
  async facebookLogin(@Body() socialLoginDto: SocialLoginDto) {
    // TODO: Implement Facebook login similar to Google
    throw new Error('Facebook login not implemented yet');
  }

  @Post('apple-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Apple OAuth' })
  @ApiResponse({ status: 200, description: 'Apple login successful' })
  async appleLogin(@Body() socialLoginDto: SocialLoginDto) {
    // TODO: Implement Apple login similar to Google
    throw new Error('Apple login not implemented yet');
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification token' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }
}
