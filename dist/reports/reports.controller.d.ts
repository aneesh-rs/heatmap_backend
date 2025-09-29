import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { QueryReportsDto } from './dto/query-reports.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(createReportDto: CreateReportDto, req: any): Promise<import("../schemas/report.schema").ReportDocument>;
    findAll(queryDto: QueryReportsDto, req: any): Promise<import("../schemas/report.schema").ReportDocument[]>;
    getReportStats(): Promise<any>;
    getUserStats(req: any): Promise<any>;
    findOne(id: string, req: any): Promise<import("../schemas/report.schema").ReportDocument>;
    updateStatus(id: string, updateStatusDto: UpdateReportStatusDto): Promise<import("../schemas/report.schema").ReportDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
