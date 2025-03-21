import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationRequest } from 'src/domain/entities/medication-request.entity';

@Module({
  imports:[TypeOrmModule.forFeature([MedicationRequest])],
  controllers: [PdfController],
  providers: [PdfService, ],
})
export class PdfModule {}
