import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from '../schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { QueryReportsDto } from './dto/query-reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    userId: string,
  ): Promise<ReportDocument> {
    const createdReport = new this.reportModel({
      ...createReportDto,
      userId,
    });
    return createdReport.save();
  }

  async findAll(
    queryDto: QueryReportsDto,
    userRole: string,
    userId?: string,
  ): Promise<ReportDocument[]> {
    const filter: any = {};

    // If user is not admin, only show their own reports
    if (userRole !== 'Admin' && userId) {
      filter.userId = userId;
    }

    // Apply query filters
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

    // Date range filter
    if (queryDto.startDate || queryDto.endDate) {
      filter.createdAt = {};
      if (queryDto.startDate) {
        filter.createdAt.$gte = new Date(queryDto.startDate);
      }
      if (queryDto.endDate) {
        // Add one day and subtract 1ms to include the entire end date
        const endDate = new Date(queryDto.endDate);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setMilliseconds(endDate.getMilliseconds() - 1);
        filter.createdAt.$lte = endDate;
      }
    }

    return this.reportModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(
    id: string,
    userRole: string,
    userId: string,
  ): Promise<ReportDocument> {
    const report = await this.reportModel.findById(id).exec();

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // Users can only access their own reports, admins can access all
    if (userRole !== 'Admin' && report.userId !== userId) {
      throw new ForbiddenException('You can only access your own reports');
    }

    return report;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateReportStatusDto,
  ): Promise<ReportDocument> {
    const updatedReport = await this.reportModel
      .findByIdAndUpdate(
        id,
        {
          reportStatus: updateStatusDto.reportStatus,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedReport) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return updatedReport;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reportModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
  }

  async getReportStats(): Promise<any> {
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

    // Reports by month (last 6 months)
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

  async getUserReportStats(userId: string): Promise<any> {
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
}
