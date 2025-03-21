import { FullBaseDto } from '../../../common/dtos';
import { Media } from '../../enums/media.enum';
import { SerializerUserDto } from '../user/user-serializer.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SerializerNotificationPreferenceDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ examples: ['2024-08-27T08:30:00'] })
  startHour?: string;

  @Expose()
  @ApiProperty({ examples: ['2024-08-27T12:30:00'] })
  endHour?: string;

  @Expose()
  @ApiProperty({ examples: [Media.EMAIL, Media.WHATSAPP] })
  media: Media;

  @Expose()
  @Type(() => SerializerUserDto)
  user: SerializerUserDto;
}

export class SerializerShortNotificationPreferencesDto extends OmitType(
  SerializerNotificationPreferenceDto,
  ['createdAt', 'deletedAt', 'user'] as const
) {}

export abstract class SerializerMedicalProviderNotificationPreferenceDto extends SerializerNotificationPreferenceDto {
  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  weeklyPatientsList: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  cancelledTurns: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  monthlyStats: boolean;

  @Expose()
  @ApiProperty({ examples: ['false', 'true'] })
  promotional: boolean;
}
