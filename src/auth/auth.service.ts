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
          await this.invitationsService.getInvitation(
            signupDto.invitationId as string,
          );
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await this.invitationsService.acceptInvitation(
          signupDto.invitationId as string,
          userId,
          user.email,
        );
      } catch {
        // best-effort; do not block signup if invitation accept fails
      }
    }

    return { message: 'Verification email sent' };
  }

  async googleLogin(socialLoginDto: SocialLoginDto) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: socialLoginDto.idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload: TokenPayload | undefined = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      let user = await this.usersService.findByEmail(payload.email || '');

      if (!user) {
        // Create new user from Google profile
        const userId = uuidv4();
        user = await this.usersService.create({
          id: userId,
          email: payload.email,
          name: payload.given_name || payload.name,
          firstSurname: payload.family_name || '',
          role: 'User',
          photoURL: payload.picture,
          emailVerified: true, // Google emails are pre-verified
        });
      }

      const jwtPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      } as const;
      return {
        access_token: this.jwtService.sign(jwtPayload),
        user,
      };
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
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
}
