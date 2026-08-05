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
var SentiloService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentiloService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let SentiloService = SentiloService_1 = class SentiloService {
    httpService;
    configService;
    logger = new common_1.Logger(SentiloService_1.name);
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async fetchSensorData(sensorId, config) {
        const sentiloConfig = config || this.getDefaultConfig();
        try {
            const url = `${sentiloConfig.baseUrl}/data/${sensorId}`;
            this.logger.log(`Fetching data from Sentilo API: ${url}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: {
                    'IDENTITY_KEY': sentiloConfig.identityKey,
                    'Content-Type': 'application/json',
                },
            }));
            this.logger.log(`Successfully fetched data for sensor: ${sensorId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error fetching data from Sentilo API: ${error.message}`, error.stack);
            if (error.response) {
                throw new common_1.BadRequestException(`Sentilo API error: ${error.response.status} - ${error.response.statusText}`);
            }
            throw new common_1.BadRequestException(`Failed to fetch data from Sentilo API: ${error.message}`);
        }
    }
    async fetchMultipleSensors(sensorIds, config) {
        const promises = sensorIds.map((sensorId) => this.fetchSensorData(sensorId, config));
        try {
            return await Promise.all(promises);
        }
        catch (error) {
            this.logger.error(`Error fetching multiple sensors: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to fetch data from multiple sensors: ${error.message}`);
        }
    }
    getDefaultConfig() {
        const baseUrl = this.configService.get('SENTILO_BASE_URL');
        const identityKey = this.configService.get('SENTILO_IDENTITY_KEY');
        if (!baseUrl || !identityKey) {
            throw new common_1.BadRequestException('Sentilo configuration missing. Please provide SENTILO_BASE_URL and SENTILO_IDENTITY_KEY environment variables.');
        }
        return {
            baseUrl: baseUrl.replace(/\/$/, ''),
            identityKey,
        };
    }
};
exports.SentiloService = SentiloService;
exports.SentiloService = SentiloService = SentiloService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], SentiloService);
//# sourceMappingURL=sentilo.service.js.map