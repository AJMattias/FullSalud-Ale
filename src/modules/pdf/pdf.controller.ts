import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CreatePdfDto } from '../../domain/dtos/pdf/create-pdf.dto';
import { UpdatePdfDto } from '../../domain/dtos/pdf/update-pdf.dto';
import { buffer } from 'stream/consumers';

@Controller('pdf')
//https://www.youtube.com/watch?v=3vg-9yr4hTE&list=PLt0PVme_2Q1sDvfV_b6hnb-ct0yl2plV2&index=2
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('create')
  async createPDF(@Res() res,  @Body() createPdfDto: CreatePdfDto): Promise<void> {
    const buffer = await this.pdfService.createPdfReceta(createPdfDto)
    res.set({
      'ContentType': 'application/json',
      'Content-Disposition' : 'attachment: filename-recetaPdf',
      'Content-length': buffer.length
    })
    res.end(buffer)
  }

  @Post('downloadIndications')
  async IndicationsPDF(@Res() res,  @Body() createPdfDto: CreatePdfDto): Promise<void> {
    const buffer = await this.pdfService.createPdfIndicaciones(createPdfDto)
    res.set({
      'ContentType': 'application/json',
      'Content-Disposition' : 'attachment: filename-recetaPdf',
      'Content-length': buffer.length
    })
    res.end(buffer)
  }

   

  //download files
  //https://www.youtube.com/watch?v=vVAlzmF8tfw&list=PLt0PVme_2Q1sDvfV_b6hnb-ct0yl2plV2&index=6
  // @Get(":filename")
  // downloadFile(@Param('filename') FilterRuleName, @Res() res): Observable<Object>{
  // return off(res.sendFile(join(process.cwd(), 'uploads/'+filename)))
  // }

}
