import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SerializerMedicalProviderNotificationPreferenceDto } from '../notification-preference-serializer.dto';
import { Expose } from 'class-transformer';

export class SerializerPractitionerSecretaryNotificationPreferencesDto extends SerializerMedicalProviderNotificationPreferenceDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests: boolean;
}

export class SerializerShortPractitionerSecretaryNotificationPreferencesDto extends OmitType(
  SerializerPractitionerSecretaryNotificationPreferencesDto,
  ['createdAt', 'deletedAt', 'user'] as const
) {}
