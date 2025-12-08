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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FtpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtpService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
let FtpService = FtpService_1 = class FtpService {
    configService;
    logger = new common_1.Logger(FtpService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    async downloadFile(filePath, config) {
        const connectionConfig = config || this.getDefaultConfig();
        const client = new ssh2_sftp_client_1.default();
        try {
            await client.connect({
                host: connectionConfig.host,
                port: connectionConfig.port || (connectionConfig.protocol === 'ftp' ? 21 : 22),
                username: connectionConfig.username,
                password: connectionConfig.password,
                ...(connectionConfig.protocol === 'sftp' && {
                    readyTimeout: 20000,
                }),
            });
            this.logger.log(`Connected to ${connectionConfig.protocol || 'SFTP'} server at ${connectionConfig.host}`);
            const fileExists = await client.exists(filePath);
            if (!fileExists) {
                throw new common_1.BadRequestException(`File not found on server: ${filePath}`);
            }
            const buffer = await client.get(filePath);
            this.logger.log(`Successfully downloaded file: ${filePath}`);
            if (Buffer.isBuffer(buffer)) {
                return buffer;
            }
            else if (typeof buffer === 'string') {
                return Buffer.from(buffer);
            }
            else {
                throw new common_1.BadRequestException('File download returned unexpected type');
            }
        }
        catch (error) {
            this.logger.error(`Error downloading file from FTP/SFTP: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to download file: ${error.message}`);
        }
        finally {
            if (client) {
                try {
                    await client.end();
                }
                catch (error) {
                    this.logger.warn(`Error closing FTP/SFTP connection: ${error.message}`);
                }
            }
        }
    }
    getDefaultConfig() {
        const host = this.configService.get('FTP_HOST');
        const username = this.configService.get('FTP_USERNAME');
        const password = this.configService.get('FTP_PASSWORD');
        const port = this.configService.get('FTP_PORT');
        const protocol = this.configService.get('FTP_PROTOCOL', 'sftp');
        if (!host || !username || !password) {
            throw new common_1.BadRequestException('FTP configuration missing. Please provide FTP_HOST, FTP_USERNAME, and FTP_PASSWORD environment variables.');
        }
        return {
            host,
            port: port || (protocol === 'ftp' ? 21 : 22),
            username,
            password,
            protocol,
        };
    }
};
exports.FtpService = FtpService;
exports.FtpService = FtpService = FtpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FtpService);
//# sourceMappingURL=ftp.service.js.map