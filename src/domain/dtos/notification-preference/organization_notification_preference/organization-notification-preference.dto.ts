import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateMedicalProviderNotificationPreferenceDto } from '../notification-preference.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationNotificationPreferenceDto extends UpdateMedicalProviderNotificationPreferenceDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  derivationRequests?: boolean;
}
