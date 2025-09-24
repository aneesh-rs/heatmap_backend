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
exports.ReportSchema = exports.Report = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
class Location {
    lat;
    lng;
    address;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Location.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], Location.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Location.prototype, "address", void 0);
let Report = class Report {
    userId;
    feeling;
    category;
    reportText;
    firstName;
    lastName;
    location;
    reportStatus;
    createdAt;
    updatedAt;
};
exports.Report = Report;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'],
    }),
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'],
    }),
    __metadata("design:type", String)
], Report.prototype, "feeling", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['rubbish', 'vandalism', 'hazard', 'traffic', 'others'],
    }),
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['rubbish', 'vandalism', 'hazard', 'traffic', 'others'],
    }),
    __metadata("design:type", String)
], Report.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "reportText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Location }),
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Report.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Pending', 'New', 'Closed'] }),
    (0, mongoose_1.Prop)({ required: true, enum: ['Pending', 'New', 'Closed'], default: 'New' }),
    __metadata("design:type", String)
], Report.prototype, "reportStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Report.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Report.prototype, "updatedAt", void 0);
exports.Report = Report = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Report);
exports.ReportSchema = mongoose_1.SchemaFactory.createForClass(Report);
//# sourceMappingURL=report.schema.js.map