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
exports.QueryReportsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class QueryReportsDto {
    status;
    category;
    feeling;
    startDate;
    endDate;
    search;
}
exports.QueryReportsDto = QueryReportsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['Pending', 'New', 'Closed'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['Pending', 'New', 'Closed']),
    __metadata("design:type", String)
], QueryReportsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: ['rubbish', 'vandalism', 'hazard', 'traffic', 'others'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['rubbish', 'vandalism', 'hazard', 'traffic', 'others']),
    __metadata("design:type", String)
], QueryReportsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: ['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised']),
    __metadata("design:type", String)
], QueryReportsDto.prototype, "feeling", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Start date for filtering (YYYY-MM-DD)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryReportsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'End date for filtering (YYYY-MM-DD)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryReportsDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Search in report text' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryReportsDto.prototype, "search", void 0);
//# sourceMappingURL=query-reports.dto.js.map