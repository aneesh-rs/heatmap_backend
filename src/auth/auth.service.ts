import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { InvitationsService } from '../invitations/invitations.service';
import { InvitationDocument } from '../schemas/invitation.schema';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private invitationsService: InvitationsService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<{ id: string; email: string; role: string } | null> {
    const user: UserDocument | null =
      await this.usersService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      if (!user.emailVerified) {
        throw new UnauthorizedException('Please verify your email first');
      }
      return { id: user.id, email: user.email, role: user.role };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    } as const;
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async signup(signupDto: SignupDto) {
    const existingUser = await this.usersService.findByEmail(signupDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const verificationToken = uuidv4();
    const userId = uuidv4();

    let roleToAssign: 'Admin' | 'User' = 'User';
    if (signupDto.invitationId) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const invite: InvitationDocument =
          await this.invitationsService.getInvitation(signupDto.invitationId);

        roleToAssign = (invite.role as 'Admin' | 'User') || 'User';
      } catch {
        // ignore invalid invite, fallback to default role
      }
    }

    const user = await this.usersService.create({
      ...signupDto,
      id: userId,
      password: hashedPassword,
      role: roleToAssign,
      emailVerified: false,
      verificationToken,
    });

    await this.sendVerificationEmail(user.email, verificationToken);

    if (signupDto.invitationId) {
      try {
        await this.invitationsService.acceptInvitation(
          signupDto.invitationId,
          userId,
          user.email,
        );
      } catch (err) {
        console.log(err);
      }
    }

    return { message: 'Verification email sent' };
  }

  async googleLogin(dto: SocialLoginDto) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: dto.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid Google token');
    }

    // Try to find user first
    let user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      // ----- INVITATION / ROLE LOGIC -----
      let roleToAssign: 'Admin' | 'User' = 'User';
      if (dto.invitationId) {
        try {
          const invite = await this.invitationsService.getInvitation(
            dto.invitationId,
          );
          roleToAssign = (invite.role as 'Admin' | 'User') || 'User';
        } catch {
          // ignore invalid invite
        }
      }

      const userId = uuidv4();
      // ----- CREATE USER -----
      user = await this.usersService.create({
        id: userId,
        email: payload.email,
        name: payload.name ?? payload.given_name ?? 'Google User',
        role: roleToAssign,
        photoURL: payload.picture ?? '',
        emailVerified: true,
      });

      // ----- MARK INVITATION ACCEPTED -----
      if (dto.invitationId) {
        try {
          await this.invitationsService.acceptInvitation(
            dto.invitationId,
            user.id,
            user.email,
          );
        } catch (err) {
          console.error(err);
        }
      }
    }

    // ----- ISSUE APP JWT -----
    const jwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    } as const;
    return {
      access_token: this.jwtService.sign(jwtPayload),
      user,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.usersService.update(user.id, {
      emailVerified: true,
      verificationToken: null,
    });

    return { message: 'Email verified successfully' };
  }

  private async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      template: './verification',
      context: {
        verificationUrl,
      },
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    await this.usersService.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    await this.sendResetPasswordEmail(user.email, resetToken);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByResetPasswordToken(
      resetPasswordDto.token,
    );
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { message: 'Password reset successfully' };
  }

  private async sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: './reset-password',
      context: {
        resetUrl,
      },
    });
  }
}
