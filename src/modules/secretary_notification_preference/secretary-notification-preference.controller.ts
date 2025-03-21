import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SecretaryNotificationPreference } from '../../domain/entities';
import {
  UpdateSecretaryNotificationPreferenceDto,
  SerializerSecretaryNotificationPreferenceDto,
  SerializerShortSecretaryNotificationPreferenceDto
} from '../../domain/dtos';
import { SecretaryNotificationPreferenceService } from './secretary-notification-preference.service';
import { NotificationPreferencesControllerFactory } from '../../common/factories/notification-preference-base-controller.factory';

@ApiTags("Secretary's Notification Preference")
@Controller('secretary-notification-preference')
export class SecretaryNotificationPreferenceController extends NotificationPreferencesControllerFactory<
  SecretaryNotificationPreference,
  UpdateSecretaryNotificationPreferenceDto,
  SerializerSecretaryNotificationPreferenceDto,
  SerializerShortSecretaryNotificationPreferenceDto
>(
  UpdateSecretaryNotificationPreferenceDto,
  SerializerSecretaryNotificationPreferenceDto,
  SerializerShortSecretaryNotificationPreferenceDto
) {
  constructor(
    protected readonly service: SecretaryNotificationPreferenceService
  ) {
    super();
  }
}
