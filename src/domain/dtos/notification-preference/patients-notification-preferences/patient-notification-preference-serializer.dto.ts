import { Expose } from 'class-transformer';
import { SerializerNotificationPreferenceDto } from '../notification-preference-serializer.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SerializerPatientNotificationPreferenceDto extends SerializerNotificationPreferenceDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  medicineTime: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  promotional: boolean;
}

export class SerializerShortPatientNotificationPreferenceDto extends OmitType(
  SerializerPatientNotificationPreferenceDto,
  ['createdAt', 'user', 'deletedAt'] as const
) {}
