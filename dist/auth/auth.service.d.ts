import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InvitationsService } from '../invitations/invitations.service';
import { UserDocument } from '../schemas/user.schema';
export declare class AuthService {
    private usersService;
    private jwtService;
    private mailerService;
    private invitationsService;
    private googleClient;
    constructor(usersService: UsersService, jwtService: JwtService, mailerService: MailerService, invitationsService: InvitationsService);
    validateUser(email: string, pass: string): Promise<{
        id: string;
        email: string;
        role: string;
    } | null>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    signup(signupDto: SignupDto): Promise<{
        message: string;
    }>;
    googleLogin(dto: SocialLoginDto): Promise<{
        access_token: string;
        user: UserDocument;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    private sendVerificationEmail;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    private sendResetPasswordEmail;
}
