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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const report_schema_1 = require("../schemas/report.schema");
let ReportsService = class ReportsService {
    reportModel;
    constructor(reportModel) {
        this.reportModel = reportModel;
    }
    async create(createReportDto, userId) {
        const createdReport = new this.reportModel({
            ...createReportDto,
            userId,
        });
        return createdReport.save();
    }
    async findAll(queryDto, userRole, userId) {
        const filter = {};
        if (userRole !== 'Admin' && userId) {
            filter.userId = userId;
        }
        if (queryDto.status) {
            filter.reportStatus = queryDto.status;
        }
        if (queryDto.category) {
            filter.category = queryDto.category;
        }
        if (queryDto.feeling) {
            filter.feeling = queryDto.feeling;
        }
        if (queryDto.search) {
            filter.reportText = { $regex: queryDto.search, $options: 'i' };
        }
        if (queryDto.startDate || queryDto.endDate) {
            filter.createdAt = {};
            if (queryDto.startDate) {
                filter.createdAt.$gte = new Date(queryDto.startDate);
            }
            if (queryDto.endDate) {
                const endDate = new Date(queryDto.endDate);
                endDate.setDate(endDate.getDate() + 1);
                endDate.setMilliseconds(endDate.getMilliseconds() - 1);
                filter.createdAt.$lte = endDate;
            }
        }
        return this.reportModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async findOne(id, userRole, userId) {
        const report = await this.reportModel.findById(id).exec();
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
        if (userRole !== 'Admin' && report.userId !== userId) {
            throw new common_1.ForbiddenException('You can only access your own reports');
        }
        return report;
    }
    async updateStatus(id, updateStatusDto) {
        const updatedReport = await this.reportModel
            .findByIdAndUpdate(id, {
            reportStatus: updateStatusDto.reportStatus,
            updatedAt: new Date(),
        }, { new: true })
            .exec();
        if (!updatedReport) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
        return updatedReport;
    }
    async remove(id) {
        const result = await this.reportModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
    }
    async getReportStats() {
        const totalReports = await this.reportModel.countDocuments().exec();
        const statusStats = await this.reportModel
            .aggregate([
            {
                $group: {
                    _id: '$reportStatus',
                    count: { $sum: 1 },
                },
            },
        ])
            .exec();
        const categoryStats = await this.reportModel
            .aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ])
            .exec();
        const feelingStats = await this.reportModel
            .aggregate([
            {
                $group: {
                    _id: '$feeling',
                    count: { $sum: 1 },
                },
            },
        ])
            .exec();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyStats = await this.reportModel
            .aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ])
            .exec();
        return {
            totalReports,
            statusStats: statusStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            categoryStats: categoryStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            feelingStats: feelingStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            monthlyStats,
        };
    }
    async getUserReportStats(userId) {
        const totalReports = await this.reportModel
            .countDocuments({ userId })
            .exec();
        const statusStats = await this.reportModel
            .aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$reportStatus',
                    count: { $sum: 1 },
                },
            },
        ])
            .exec();
        const categoryStats = await this.reportModel
            .aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ])
            .exec();
        return {
            totalReports,
            statusStats: statusStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            categoryStats: categoryStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(report_schema_1.Report.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map