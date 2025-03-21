import { ApiProperty, OmitType } from '@nestjs/swagger';
import { SerializerMedicalProviderNotificationPreferenceDto } from '../notification-preference-serializer.dto';
import { Expose } from 'class-transformer';

export class SerializerPractitionerNotificationPreferenceDto extends SerializerMedicalProviderNotificationPreferenceDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests: boolean;
}

export class SerializerShortPractitionerNotificationPreferenceDto extends OmitType(
  SerializerPractitionerNotificationPreferenceDto,
  ['createdAt', 'deletedAt', 'user'] as const
) {}
