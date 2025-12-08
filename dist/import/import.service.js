"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportService = void 0;
const common_1 = require("@nestjs/common");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
let ImportService = ImportService_1 = class ImportService {
    logger = new common_1.Logger(ImportService_1.name);
    async parseCsv(buffer, options = {}) {
        const { latField = 'lat', lngField = 'lng', noiseValueField = 'noiseValue', timestampField = 'timestamp', } = options;
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = stream_1.Readable.from(buffer);
            stream
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => {
                try {
                    const dataPoint = this.mapRowToNoiseData(row, {
                        latField,
                        lngField,
                        noiseValueField,
                        timestampField,
                    });
                    results.push(dataPoint);
                }
                catch (error) {
                    this.logger.warn(`Skipping invalid row: ${JSON.stringify(row)} - ${error.message}`);
                }
            })
                .on('end', () => {
                this.logger.log(`Parsed ${results.length} data points from CSV`);
                resolve(results);
            })
                .on('error', (error) => {
                this.logger.error(`Error parsing CSV: ${error.message}`, error.stack);
                reject(new common_1.BadRequestException(`Failed to parse CSV: ${error.message}`));
            });
        });
    }
    async parseJson(buffer, options = {}) {
        const { latField = 'lat', lngField = 'lng', noiseValueField = 'noiseValue', timestampField = 'timestamp', } = options;
        try {
            const jsonString = buffer.toString('utf-8');
            const data = JSON.parse(jsonString);
            const dataArray = Array.isArray(data) ? data : [data];
            const results = dataArray.map((row, index) => {
                try {
                    return this.mapRowToNoiseData(row, {
                        latField,
                        lngField,
                        noiseValueField,
                        timestampField,
                    });
                }
                catch (error) {
                    this.logger.warn(`Skipping invalid row at index ${index}: ${error.message}`);
                    throw error;
                }
            }).filter(Boolean);
            this.logger.log(`Parsed ${results.length} data points from JSON`);
            return results;
        }
        catch (error) {
            this.logger.error(`Error parsing JSON: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to parse JSON: ${error.message}`);
        }
    }
    mapRowToNoiseData(row, options) {
        const { latField, lngField, noiseValueField, timestampField } = options;
        const lat = this.extractNumericValue(row, latField, 'latitude');
        const lng = this.extractNumericValue(row, lngField, 'longitude');
        const noiseValue = this.extractNumericValue(row, noiseValueField, 'noise');
        const timestamp = this.extractTimestamp(row, timestampField);
        if (lat === null || lng === null || noiseValue === null) {
            throw new Error(`Missing required fields: lat=${lat}, lng=${lng}, noiseValue=${noiseValue}`);
        }
        return {
            lat,
            lng,
            noiseValue,
            timestamp,
        };
    }
    extractNumericValue(row, primaryField, alternativeFields) {
        const alternatives = Array.isArray(alternativeFields)
            ? alternativeFields
            : [alternativeFields];
        const allFields = [primaryField, ...alternatives];
        for (const field of allFields) {
            const keys = Object.keys(row).filter((key) => key.toLowerCase() === field.toLowerCase());
            if (keys.length > 0) {
                const value = row[keys[0]];
                const numValue = typeof value === 'string' ? parseFloat(value) : value;
                if (!isNaN(numValue) && numValue !== null && numValue !== undefined) {
                    return numValue;
                }
            }
        }
        return null;
    }
    extractTimestamp(row, timestampField) {
        const keys = Object.keys(row).filter((key) => key.toLowerCase() === timestampField.toLowerCase());
        if (keys.length > 0) {
            const value = row[keys[0]];
            if (value) {
                if (typeof value === 'string') {
                    const date = new Date(value);
                    if (!isNaN(date.getTime())) {
                        return date.toISOString();
                    }
                }
                return value;
            }
        }
        return new Date().toISOString();
    }
};
exports.ImportService = ImportService;
exports.ImportService = ImportService = ImportService_1 = __decorate([
    (0, common_1.Injectable)()
], ImportService);
//# sourceMappingURL=import.service.js.map