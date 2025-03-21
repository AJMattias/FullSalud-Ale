import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminNotificationPreferenceService } from './admin-notification-preference.service';
import { AdminNotificationPreference } from '../../domain/entities';
import { SerializerAdminNotificationPreferenceDto, SerializerShortAdminNotificationPreferenceDto, UpdateAdminNotificationPreferenceDto } from '../../domain/dtos';
import { NotificationPreferencesControllerFactory } from '../../common/factories/notification-preference-base-controller.factory';

@ApiTags("Admin's Notification Preferences")
@Controller('admin-notification-preference')
export class AdminNotificationPreferenceController extends NotificationPreferencesControllerFactory<
    AdminNotificationPreference,
    UpdateAdminNotificationPreferenceDto,
    SerializerAdminNotificationPreferenceDto,
    SerializerShortAdminNotificationPreferenceDto
>(
    UpdateAdminNotificationPreferenceDto,
    SerializerAdminNotificationPreferenceDto,
    SerializerShortAdminNotificationPreferenceDto
) {
    constructor(
        protected readonly service: AdminNotificationPreferenceService
    ) {
        super();
    }
}
