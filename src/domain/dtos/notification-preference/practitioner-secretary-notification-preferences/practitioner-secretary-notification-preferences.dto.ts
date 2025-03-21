import { IsBoolean, IsOptional } from 'class-validator';
import { UpdateMedicalProviderNotificationPreferenceDto } from '../notification-preference.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePractitionerSecretaryNotificationPreferencesDto extends UpdateMedicalProviderNotificationPreferenceDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests?: boolean;
}
