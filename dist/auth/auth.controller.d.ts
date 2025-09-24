import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    googleLogin(socialLoginDto: SocialLoginDto): Promise<{
        access_token: string;
        user: import("../schemas/user.schema").UserDocument;
    }>;
    facebookLogin(socialLoginDto: SocialLoginDto): Promise<void>;
    appleLogin(socialLoginDto: SocialLoginDto): Promise<void>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
}
