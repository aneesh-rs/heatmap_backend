import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ResetPasswordGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token } = request.body;

    if (!token) {
      throw new BadRequestException('Reset token is required');
    }

    const user = await this.usersService.findByResetPasswordToken(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token has expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Attach user to request for later use in the controller
    request.user = user;

    return true;
  }
}
