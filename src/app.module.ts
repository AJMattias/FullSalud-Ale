import { Module } from '@nestjs/common';
import { databaseProviders } from './config/database.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesModule } from './modules/modules.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { PatientPractitionerFavoriteModule } from './modules/patient_practitioner_favorite/patient-practitioner-favorite.module';
import { PdfModule } from './modules/pdf/pdf.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseProviders), ModulesModule, PatientPractitionerFavoriteModule, PdfModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
