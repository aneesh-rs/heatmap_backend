import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { QueryReportsDto } from './dto/query-reports.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Report } from '../schemas/report.schema';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
    type: Report,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  async create(@Body() createReportDto: CreateReportDto, @Request() req) {
    return this.reportsService.create(createReportDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports (filtered by role)' })
  @ApiResponse({ status: 200, description: 'List of reports', type: [Report] })
  async findAll(@Query() queryDto: QueryReportsDto, @Request() req) {
    return this.reportsService.findAll(queryDto, req.user.role, req.user.id);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Get report statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Report statistics' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getReportStats() {
    return this.reportsService.getReportStats();
  }

  @Get('my-stats')
  @ApiOperation({ summary: 'Get current user report statistics' })
  @ApiResponse({ status: 200, description: 'User report statistics' })
  async getUserStats(@Request() req) {
    return this.reportsService.getUserReportStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report details', type: Report })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Can only access own reports or admin access required',
  })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.reportsService.findOne(id, req.user.role, req.user.id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Update report status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({
    status: 200,
    description: 'Report status updated successfully',
    type: Report,
  })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateReportStatusDto,
  ) {
    return this.reportsService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete report by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(@Param('id') id: string) {
    await this.reportsService.remove(id);
    return { message: 'Report deleted successfully' };
  }
}
