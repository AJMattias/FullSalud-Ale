import { forwardRef, Module } from '@nestjs/common';
import { PractitionerService } from './practitioner.service';
import { PractitionerController } from './practitioner.controller';
import { ProfessionalDegree, Location, Patient, Practitioner, PractitionerRole } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Practitioner, PractitionerRole, ProfessionalDegree, Patient, Location]) ,
  forwardRef(() => AuthModule)],
  controllers: [PractitionerController],
  providers: [PractitionerService],
  exports: [PractitionerService]
})
export class PractitionerModule {}
