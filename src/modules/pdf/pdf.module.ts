import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationRequest } from '../../domain/entities/medication-request.entity';
import { generateBarcode, generateQRCode } from '../../common/util/generateBarCode';

@Module({
  imports:[TypeOrmModule.forFeature([MedicationRequest])],
  controllers: [PdfController],
  providers: [PdfService, generateBarcode, generateQRCode ],
})
export class PdfModule {}
