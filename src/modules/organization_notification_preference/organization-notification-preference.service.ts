import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CreateNotificationPreferenceDto,
  UpdateOrganizationNotificationPreferenceDto
} from '../../domain/dtos';
import { OrganizationNotificationPreference } from '../../domain/entities';
import { Repository } from 'typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/i-notification-preference-base.service';

@Injectable()
export class OrganizationNotificationPreferenceService extends NotificationPreferencesServiceFactory<
  OrganizationNotificationPreference,
  CreateNotificationPreferenceDto,
  UpdateOrganizationNotificationPreferenceDto
>(OrganizationNotificationPreference) {
  constructor(
    @InjectRepository(OrganizationNotificationPreference)
    protected readonly repository: Repository<OrganizationNotificationPreference>
  ) {
    super(repository);
  }
}
