import { Model } from 'mongoose';
import { ReportDocument } from '../schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { QueryReportsDto } from './dto/query-reports.dto';
export declare class ReportsService {
    private reportModel;
    constructor(reportModel: Model<ReportDocument>);
    create(createReportDto: CreateReportDto, userId: string): Promise<ReportDocument>;
    findAll(queryDto: QueryReportsDto, userRole: string, userId?: string): Promise<ReportDocument[]>;
    findOne(id: string, userRole: string, userId: string): Promise<ReportDocument>;
    updateStatus(id: string, updateStatusDto: UpdateReportStatusDto): Promise<ReportDocument>;
    remove(id: string): Promise<void>;
    getReportStats(): Promise<any>;
    getUserReportStats(userId: string): Promise<any>;
}
