import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FtpService } from './ftp.service';
import { SentiloService } from './sentilo.service';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';

@Module({
  imports: [HttpModule],
  controllers: [ImportController],
  providers: [FtpService, SentiloService, ImportService],
  exports: [FtpService, SentiloService, ImportService],
})
export class ImportModule {}

