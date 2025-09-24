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
exports.CreateReportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class LocationDto {
    lat;
    lng;
    address;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude coordinate' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LocationDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude coordinate' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LocationDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Address description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationDto.prototype, "address", void 0);
class CreateReportDto {
    feeling;
    category;
    reportText;
    firstName;
    lastName;
    location;
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'],
        description: 'User feeling when making the report',
    }),
    (0, class_validator_1.IsEnum)(['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised']),
    __metadata("design:type", String)
], CreateReportDto.prototype, "feeling", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['rubbish', 'vandalism', 'hazard', 'traffic', 'others'],
        description: 'Category of the report',
    }),
    (0, class_validator_1.IsEnum)(['rubbish', 'vandalism', 'hazard', 'traffic', 'others']),
    __metadata("design:type", String)
], CreateReportDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed report description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "reportText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reporter first name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reporter last name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: LocationDto,
        description: 'Location where the report was made',
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationDto),
    __metadata("design:type", LocationDto)
], CreateReportDto.prototype, "location", void 0);
//# sourceMappingURL=create-report.dto.js.map