import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FtpService } from './ftp.service';
import { SentiloService } from './sentilo.service';
import { ImportService } from './import.service';
import { ImportController } from './import.controller';
import { CloudNoiseService } from './cloudnoise.service';

@Module({
  imports: [HttpModule],
  controllers: [ImportController],
  providers: [FtpService, SentiloService, ImportService, CloudNoiseService],
  exports: [FtpService, SentiloService, ImportService, CloudNoiseService],
})
export class ImportModule {}

