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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const create_report_dto_1 = require("./dto/create-report.dto");
const update_report_status_dto_1 = require("./dto/update-report-status.dto");
const query_reports_dto_1 = require("./dto/query-reports.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const report_schema_1 = require("../schemas/report.schema");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async create(createReportDto, req) {
        return this.reportsService.create(createReportDto, req.user.id);
    }
    async findAll(queryDto, req) {
        return this.reportsService.findAll(queryDto, req.user.role, req.user.id);
    }
    async getReportStats() {
        return this.reportsService.getReportStats();
    }
    async getUserStats(req) {
        return this.reportsService.getUserReportStats(req.user.id);
    }
    async findOne(id, req) {
        return this.reportsService.findOne(id, req.user.role, req.user.id);
    }
    async updateStatus(id, updateStatusDto) {
        return this.reportsService.updateStatus(id, updateStatusDto);
    }
    async remove(id) {
        await this.reportsService.remove(id);
        return { message: 'Report deleted successfully' };
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new report' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Report created successfully',
        type: report_schema_1.Report,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid data' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_dto_1.CreateReportDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reports (filtered by role)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of reports', type: [report_schema_1.Report] }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_reports_dto_1.QueryReportsDto, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report statistics (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReportStats", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user report statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User report statistics' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get report by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Report ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report details', type: report_schema_1.Report }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Can only access own reports or admin access required',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update report status (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Report ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Report status updated successfully',
        type: report_schema_1.Report,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_report_status_dto_1.UpdateReportStatusDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete report by ID (Admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Report ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Report not found' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Admin access required',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "remove", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map