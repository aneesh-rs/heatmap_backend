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
exports.InvitationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invitations_service_1 = require("./invitations.service");
const create_invitation_dto_1 = require("./dto/create-invitation.dto");
const accept_invitation_dto_1 = require("./dto/accept-invitation.dto");
let InvitationsController = class InvitationsController {
    invitationsService;
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
    }
    async createInvitation(body) {
        const invite = await this.invitationsService.createInvitation(body.inviterId, body.role, body.reservedEmail);
        const invitationLink = `${process.env.FRONTEND_URL}/signup?invitationId=${invite.id}`;
        return {
            invitationId: invite.id,
            invitationLink,
            invite,
        };
    }
    async getInvitation(id) {
        return this.invitationsService.getInvitation(id);
    }
    async accept(body) {
        return this.invitationsService.acceptInvitation(body.invitationId, body.userId, body.email);
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create invitation link' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invitation_dto_1.CreateInvitationDto]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "createInvitation", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invitation by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "getInvitation", null);
__decorate([
    (0, common_1.Post)('accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept invitation (manual endpoint if needed)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [accept_invitation_dto_1.AcceptInvitationDto]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "accept", null);
exports.InvitationsController = InvitationsController = __decorate([
    (0, swagger_1.ApiTags)('invitations'),
    (0, common_1.Controller)('invitations'),
    __metadata("design:paramtypes", [invitations_service_1.InvitationsService])
], InvitationsController);
//# sourceMappingURL=invitations.controller.js.map