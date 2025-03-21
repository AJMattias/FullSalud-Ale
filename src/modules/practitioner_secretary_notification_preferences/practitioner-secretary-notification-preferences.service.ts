import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateNotificationPreferenceDto,
  UpdatePractitionerSecretaryNotificationPreferencesDto
} from '../../domain/dtos';
import { PractitionerSecretaryNotificationPreferences } from '../../domain/entities';
import { Repository } from 'typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/i-notification-preference-base.service';

@Injectable()
export class PractitionerSecretaryNotificationPreferencesService extends NotificationPreferencesServiceFactory<
  PractitionerSecretaryNotificationPreferences,
  CreateNotificationPreferenceDto,
  UpdatePractitionerSecretaryNotificationPreferencesDto
>(PractitionerSecretaryNotificationPreferences) {
  constructor(
    @InjectRepository(PractitionerSecretaryNotificationPreferences)
    protected readonly repository: Repository<PractitionerSecretaryNotificationPreferences>
  ) {
    super(repository);
  }
}
