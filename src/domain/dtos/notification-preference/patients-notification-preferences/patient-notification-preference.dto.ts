import { IsBoolean, IsOptional } from 'class-validator';
import { UpdateNotificationPreferenceDto } from '../notification-preference.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePatientNotificationPreferenceDto extends UpdateNotificationPreferenceDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  medicineTime?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  promotional?: boolean;
}
