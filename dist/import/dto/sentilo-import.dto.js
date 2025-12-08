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
exports.SentiloImportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class SentiloConfigDto {
    baseUrl;
    identityKey;
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sentilo API base URL' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SentiloConfigDto.prototype, "baseUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sentilo IDENTITY_KEY' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SentiloConfigDto.prototype, "identityKey", void 0);
class ParseOptionsDto {
    latField;
    lngField;
    noiseValueField;
    timestampField;
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Field name for latitude',
        default: 'lat',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ParseOptionsDto.prototype, "latField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Field name for longitude',
        default: 'lng',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ParseOptionsDto.prototype, "lngField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Field name for noise value',
        default: 'noiseValue',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ParseOptionsDto.prototype, "noiseValueField", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Field name for timestamp',
        default: 'timestamp',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ParseOptionsDto.prototype, "timestampField", void 0);
class SentiloImportDto {
    sensorId;
    sentiloConfig;
    parseOptions;
}
exports.SentiloImportDto = SentiloImportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sensor ID to fetch data from',
        example: 'sensor-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SentiloImportDto.prototype, "sensorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional Sentilo configuration (uses env vars if not provided)',
        type: SentiloConfigDto,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SentiloConfigDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", SentiloConfigDto)
], SentiloImportDto.prototype, "sentiloConfig", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional field mapping configuration',
        type: ParseOptionsDto,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ParseOptionsDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", ParseOptionsDto)
], SentiloImportDto.prototype, "parseOptions", void 0);
//# sourceMappingURL=sentilo-import.dto.js.map