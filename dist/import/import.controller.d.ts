import { FtpService } from './ftp.service';
import { SentiloService } from './sentilo.service';
import { ImportService, NoiseDataPoint } from './import.service';
import { FtpImportDto } from './dto/ftp-import.dto';
import { SentiloImportDto } from './dto/sentilo-import.dto';
export declare class ImportController {
    private readonly ftpService;
    private readonly sentiloService;
    private readonly importService;
    constructor(ftpService: FtpService, sentiloService: SentiloService, importService: ImportService);
    importFromFtp(dto: FtpImportDto): Promise<{
        success: boolean;
        dataPoints: NoiseDataPoint[];
        count: number;
    }>;
    importFromSentilo(dto: SentiloImportDto): Promise<{
        success: boolean;
        dataPoints: NoiseDataPoint[];
        count: number;
    }>;
    private detectFileFormat;
    private transformSentiloData;
}
