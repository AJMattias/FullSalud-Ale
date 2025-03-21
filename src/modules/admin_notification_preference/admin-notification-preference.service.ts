import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationPreferencesServiceFactory } from '../../common/bases/i-notification-preference-base.service';
import { CreateNotificationPreferenceDto, UpdateAdminNotificationPreferenceDto } from '../../domain/dtos';
import { AdminNotificationPreference } from '../../domain/entities';

import { Repository } from 'typeorm';

@Injectable()
export class AdminNotificationPreferenceService extends NotificationPreferencesServiceFactory<
  AdminNotificationPreference,
  CreateNotificationPreferenceDto,
  UpdateAdminNotificationPreferenceDto
>(AdminNotificationPreference) {
  constructor(
    @InjectRepository(AdminNotificationPreference)
    protected readonly repository: Repository<AdminNotificationPreference>
  ) {
    super(repository);
  }
}
