import { forwardRef, Module } from '@nestjs/common';
import { PatientPractitionerFavoriteService } from './patient-practitioner-favorite.service';
import { PatientPractitionerFavoriteController } from './patient-practitioner-favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientPractitionerFavorite } from '../../domain/entities/patient-practitioner-favorite.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([PatientPractitionerFavorite]), 
          forwardRef(()=>AuthModule),],
  controllers: [PatientPractitionerFavoriteController],
  providers: [PatientPractitionerFavoriteService],
  exports:[PatientPractitionerFavoriteService]
})
export class PatientPractitionerFavoriteModule {}
