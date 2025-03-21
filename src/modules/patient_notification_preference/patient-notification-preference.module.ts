import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PatientNotificationPreference } from '../../domain/entities';
import { PatientNotificationPreferenceController } from './patient-notification-preference.controller';
import { PatientNotificationPreferenceService } from './patient-notification-preference.service';

@Module({
    imports: [TypeOrmModule.forFeature([PatientNotificationPreference])],
    controllers: [PatientNotificationPreferenceController],
    providers: [PatientNotificationPreferenceService],
    exports: [PatientNotificationPreferenceService]
})
export class PatientNotificationPreferenceModule { }
