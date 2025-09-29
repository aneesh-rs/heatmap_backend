"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordGuard = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
let ResetPasswordGuard = class ResetPasswordGuard {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const { token } = request.body;
        if (!token) {
            throw new common_1.BadRequestException('Reset token is required');
        }
        const user = await this.usersService.findByResetPasswordToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            throw new common_1.BadRequestException('Reset token has expired');
        }
        request.user = user;
        return true;
    }
};
exports.ResetPasswordGuard = ResetPasswordGuard;
exports.ResetPasswordGuard = ResetPasswordGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], ResetPasswordGuard);
//# sourceMappingURL=reset-password.guard.js.map