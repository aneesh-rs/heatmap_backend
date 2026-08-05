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
exports.FtpImportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class FtpConnectionConfigDto {
    host;
    port;
    username;
    password;
    protocol;
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'FTP/SFTP server host' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FtpConnectionConfigDto.prototype, "host", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'FTP/SFTP server port', default: 22 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], FtpConnectionConfigDto.prototype, "port", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'FTP/SFTP username' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FtpConnectionConfigDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'FTP/SFTP password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FtpConnectionConfigDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Protocol type',
        enum: ['ftp', 'sftp'],
        default: 'sftp',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FtpConnectionConfigDto.prototype, "protocol", void 0);
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
class FtpImportDto {
    filePath;
    format;
    connectionConfig;
    parseOptions;
}
exports.FtpImportDto = FtpImportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Path to the file on the FTP/SFTP server',
        example: '/data/noise-data.csv',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FtpImportDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'File format',
        enum: ['csv', 'json'],
        default: 'csv',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FtpImportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional FTP/SFTP connection configuration (uses env vars if not provided)',
        type: FtpConnectionConfigDto,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FtpConnectionConfigDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", FtpConnectionConfigDto)
], FtpImportDto.prototype, "connectionConfig", void 0);
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
], FtpImportDto.prototype, "parseOptions", void 0);
//# sourceMappingURL=ftp-import.dto.js.map