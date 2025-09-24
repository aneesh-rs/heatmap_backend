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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const invitation_schema_1 = require("../schemas/invitation.schema");
const uuid_1 = require("uuid");
let InvitationsService = class InvitationsService {
    invitationModel;
    constructor(invitationModel) {
        this.invitationModel = invitationModel;
    }
    async createInvitation(inviterId, role, reservedEmail) {
        const invitationId = (0, uuid_1.v4)();
        const invite = new this.invitationModel({
            id: invitationId,
            inviterId,
            role,
            reservedEmail,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await invite.save();
        return invite;
    }
    async getInvitation(invitationId) {
        const invite = await this.invitationModel
            .findOne({ id: invitationId })
            .exec();
        if (!invite) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        return invite;
    }
    async markVerificationSent(invitationId) {
        const result = await this.invitationModel
            .findOneAndUpdate({ id: invitationId }, { status: 'verification_sent', updatedAt: new Date() }, { new: true })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        return result;
    }
    async acceptInvitation(invitationId, acceptedByUserId, emailUsed) {
        const invite = await this.getInvitation(invitationId);
        if (invite.status === 'accepted') {
            throw new common_1.BadRequestException('Invitation already accepted');
        }
        if (invite.reservedEmail &&
            invite.reservedEmail.toLowerCase() !== emailUsed.toLowerCase()) {
            throw new common_1.BadRequestException('Invitation email mismatch');
        }
        invite.status = 'accepted';
        invite.acceptedBy = acceptedByUserId;
        invite.updatedAt = new Date();
        await invite.save();
        return invite;
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invitation_schema_1.Invitation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map