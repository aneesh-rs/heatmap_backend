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
exports.InvitationSchema = exports.Invitation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
let Invitation = class Invitation {
    id;
    inviterId;
    role;
    status;
    reservedEmail;
    acceptedBy;
    createdAt;
    updatedAt;
};
exports.Invitation = Invitation;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Invitation.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Invitation.prototype, "inviterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Admin', 'User'] }),
    (0, mongoose_1.Prop)({ required: true, enum: ['Admin', 'User'] }),
    __metadata("design:type", String)
], Invitation.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['pending', 'verification_sent', 'accepted'] }),
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['pending', 'verification_sent', 'accepted'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Invitation.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Invitation.prototype, "reservedEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Invitation.prototype, "acceptedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Invitation.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Invitation.prototype, "updatedAt", void 0);
exports.Invitation = Invitation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Invitation);
exports.InvitationSchema = mongoose_1.SchemaFactory.createForClass(Invitation);
//# sourceMappingURL=invitation.schema.js.map