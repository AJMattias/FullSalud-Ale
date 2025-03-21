import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateNotificationPreferenceDto,
  UpdatePractitionerNotificationPreferenceDto
} from '../../domain/dtos';
import { PractitionerNotificationPreference } from '../../domain/entities';
import { Repository } from 'typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/i-notification-preference-base.service';

@Injectable()
export class PractitionerNotificationPreferenceService extends NotificationPreferencesServiceFactory<
  PractitionerNotificationPreference,
  CreateNotificationPreferenceDto,
  UpdatePractitionerNotificationPreferenceDto
>(PractitionerNotificationPreference) {
  constructor(
    @InjectRepository(PractitionerNotificationPreference)
    protected readonly repository: Repository<PractitionerNotificationPreference>
  ) {
    super(repository);
  }
}
