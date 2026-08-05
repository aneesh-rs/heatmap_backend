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
exports.ImportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ftp_service_1 = require("./ftp.service");
const sentilo_service_1 = require("./sentilo.service");
const import_service_1 = require("./import.service");
const ftp_import_dto_1 = require("./dto/ftp-import.dto");
const sentilo_import_dto_1 = require("./dto/sentilo-import.dto");
let ImportController = class ImportController {
    ftpService;
    sentiloService;
    importService;
    constructor(ftpService, sentiloService, importService) {
        this.ftpService = ftpService;
        this.sentiloService = sentiloService;
        this.importService = importService;
    }
    async importFromFtp(dto) {
        try {
            const connectionConfig = dto.connectionConfig
                ? {
                    host: dto.connectionConfig.host,
                    port: dto.connectionConfig.port,
                    username: dto.connectionConfig.username,
                    password: dto.connectionConfig.password,
                    protocol: dto.connectionConfig.protocol,
                }
                : undefined;
            const fileBuffer = await this.ftpService.downloadFile(dto.filePath, connectionConfig);
            const format = dto.format || this.detectFileFormat(dto.filePath);
            let dataPoints;
            if (format === 'json') {
                dataPoints = await this.importService.parseJson(fileBuffer, dto.parseOptions);
            }
            else {
                dataPoints = await this.importService.parseCsv(fileBuffer, dto.parseOptions);
            }
            return {
                success: true,
                dataPoints,
                count: dataPoints.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to import data from FTP: ${error.message}`);
        }
    }
    async importFromSentilo(dto) {
        try {
            const sentiloConfig = dto.sentiloConfig
                ? {
                    baseUrl: dto.sentiloConfig.baseUrl,
                    identityKey: dto.sentiloConfig.identityKey,
                }
                : undefined;
            const sensorData = await this.sentiloService.fetchSensorData(dto.sensorId, sentiloConfig);
            const dataPoints = this.transformSentiloData(sensorData, dto.parseOptions);
            return {
                success: true,
                dataPoints,
                count: dataPoints.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to import data from Sentilo: ${error.message}`);
        }
    }
    detectFileFormat(filePath) {
        const extension = filePath.toLowerCase().split('.').pop();
        if (extension === 'json') {
            return 'json';
        }
        return 'csv';
    }
    transformSentiloData(sensorData, parseOptions) {
        const { latField = 'lat', lngField = 'lng', noiseValueField = 'noiseValue', timestampField = 'timestamp', } = parseOptions || {};
        const dataPoints = [];
        if (sensorData.observations && Array.isArray(sensorData.observations)) {
            sensorData.observations.forEach((observation) => {
                try {
                    const lat = sensorData.location?.lat ||
                        sensorData.lat ||
                        observation.lat ||
                        null;
                    const lng = sensorData.location?.lng ||
                        sensorData.lng ||
                        observation.lng ||
                        null;
                    const noiseValue = observation.value !== undefined
                        ? parseFloat(String(observation.value))
                        : null;
                    const timestamp = observation.timestamp ||
                        observation.time ||
                        sensorData.timestamp ||
                        new Date().toISOString();
                    if (lat !== null && lng !== null && noiseValue !== null) {
                        dataPoints.push({
                            lat,
                            lng,
                            noiseValue,
                            timestamp,
                        });
                    }
                }
                catch (error) {
                    console.warn('Skipping invalid observation:', error);
                }
            });
        }
        else {
            const lat = sensorData.location?.lat || sensorData.lat || null;
            const lng = sensorData.location?.lng || sensorData.lng || null;
            const noiseValue = sensorData.value !== undefined
                ? parseFloat(String(sensorData.value))
                : null;
            const timestamp = sensorData.timestamp || sensorData.time || new Date().toISOString();
            if (lat !== null && lng !== null && noiseValue !== null) {
                dataPoints.push({
                    lat,
                    lng,
                    noiseValue,
                    timestamp,
                });
            }
        }
        return dataPoints;
    }
};
exports.ImportController = ImportController;
__decorate([
    (0, common_1.Post)('ftp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Import noise data from FTP/SFTP server',
        description: 'Downloads a file from FTP/SFTP server, parses it (CSV or JSON), and returns mapped noise data points.',
    }),
    (0, swagger_1.ApiBody)({ type: ftp_import_dto_1.FtpImportDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Data imported successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                dataPoints: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            lat: { type: 'number' },
                            lng: { type: 'number' },
                            noiseValue: { type: 'number' },
                            timestamp: { type: 'string' },
                        },
                    },
                },
                count: { type: 'number' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid data or file format' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ftp_import_dto_1.FtpImportDto]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "importFromFtp", null);
__decorate([
    (0, common_1.Post)('sentilo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Import noise data from Sentilo REST API',
        description: 'Fetches sensor data from Sentilo API and maps it to noise data format.',
    }),
    (0, swagger_1.ApiBody)({ type: sentilo_import_dto_1.SentiloImportDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Data imported successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                dataPoints: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            lat: { type: 'number' },
                            lng: { type: 'number' },
                            noiseValue: { type: 'number' },
                            timestamp: { type: 'string' },
                        },
                    },
                },
                count: { type: 'number' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid data or API error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sentilo_import_dto_1.SentiloImportDto]),
    __metadata("design:returntype", Promise)
], ImportController.prototype, "importFromSentilo", null);
exports.ImportController = ImportController = __decorate([
    (0, swagger_1.ApiTags)('import'),
    (0, common_1.Controller)('import'),
    __metadata("design:paramtypes", [ftp_service_1.FtpService,
        sentilo_service_1.SentiloService,
        import_service_1.ImportService])
], ImportController);
//# sourceMappingURL=import.controller.js.map