import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PractitionerNotificationPreference } from '../../domain/entities';
import {
    UpdatePractitionerNotificationPreferenceDto,
    SerializerShortPractitionerNotificationPreferenceDto,
    SerializerPractitionerNotificationPreferenceDto
} from '../../domain/dtos';
import { PractitionerNotificationPreferenceService } from './practitioner-notification-preference.service';
import { NotificationPreferencesControllerFactory } from '../../common/factories/notification-preference-base-controller.factory';

@ApiTags("Practitioner Notification Preference")
@Controller('practitioner-notification-preference')
export class PractitionerNotificationPreferenceController extends NotificationPreferencesControllerFactory<
    PractitionerNotificationPreference,
    UpdatePractitionerNotificationPreferenceDto,
    SerializerPractitionerNotificationPreferenceDto,
    SerializerShortPractitionerNotificationPreferenceDto
>(
    UpdatePractitionerNotificationPreferenceDto,
    SerializerPractitionerNotificationPreferenceDto,
    SerializerShortPractitionerNotificationPreferenceDto
) {
    constructor(
        protected readonly service: PractitionerNotificationPreferenceService
    ) {
        super();
    }
}
