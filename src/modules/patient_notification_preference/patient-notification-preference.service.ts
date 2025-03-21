import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/i-notification-preference-base.service';
import { CreateNotificationPreferenceDto, UpdatePatientNotificationPreferenceDto } from '../../domain/dtos';
import { PatientNotificationPreference } from '../../domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PatientNotificationPreferenceService extends NotificationPreferencesServiceFactory<
    PatientNotificationPreference,
    CreateNotificationPreferenceDto,
    UpdatePatientNotificationPreferenceDto
>(PatientNotificationPreference) {
    constructor(
        @InjectRepository(PatientNotificationPreference)
        protected readonly repository: Repository<PatientNotificationPreference>
    ) {
        super(repository);
    }
}
