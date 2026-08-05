import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { Report, ReportDocument } from '../schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { QueryReportsDto } from './dto/query-reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    userId: string,
  ): Promise<ReportDocument> {
    const createdReport = new this.reportModel({
      ...createReportDto,
      userId,
    });
    const savedReport = await createdReport.save();

    // Send email notification to admin
    try {
      const user = await this.usersService.findById(userId);
      const formattedCreatedAt = new Date(savedReport.createdAt).toLocaleString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        },
      );

      await this.mailerService.sendMail({
        to: process.env.ADMIN_EMAIL || 'admin@cloudnoise.com',
        subject: 'New Report Created',
        template: 'report-created',
        context: {
          userName: user.name,
          locationAddress: savedReport.location.address,
          feeling: savedReport.feeling,
          createdAt: formattedCreatedAt,
          reportText: savedReport.reportText,
        },
      });
    } catch (error) {
      // Log error but don't fail the report creation
      console.error('Failed to send email:', error);
    }

    return savedReport;
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
    const report = await this.reportModel.findOne({ id }).exec();

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
      .findOneAndUpdate(
        { id },
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

    // Send email if status changed to Closed
    if (updatedReport.reportStatus === 'Closed') {
      try {
        const user = await this.usersService.findById(updatedReport.userId);
        const formattedCreatedAt = new Date(
          updatedReport.createdAt,
        ).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        await this.mailerService.sendMail({
          to: user.email,
          subject: 'News from your report!',
          template: 'report-closed',
          context: {
            firstName: user.name,
            locationAddress: updatedReport.location.address,
            feeling: updatedReport.feeling,
            createdAt: formattedCreatedAt,
            reportText: updatedReport.reportText,
          },
        });
      } catch (error) {
        // Log error but don't fail the update
        console.error('Failed to send email:', error);
      }
    }

    return updatedReport;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reportModel.deleteOne({ id }).exec();
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
