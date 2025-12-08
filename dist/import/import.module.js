"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const ftp_service_1 = require("./ftp.service");
const sentilo_service_1 = require("./sentilo.service");
const import_service_1 = require("./import.service");
const import_controller_1 = require("./import.controller");
let ImportModule = class ImportModule {
};
exports.ImportModule = ImportModule;
exports.ImportModule = ImportModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        controllers: [import_controller_1.ImportController],
        providers: [ftp_service_1.FtpService, sentilo_service_1.SentiloService, import_service_1.ImportService],
        exports: [ftp_service_1.FtpService, sentilo_service_1.SentiloService, import_service_1.ImportService],
    })
], ImportModule);
//# sourceMappingURL=import.module.js.map