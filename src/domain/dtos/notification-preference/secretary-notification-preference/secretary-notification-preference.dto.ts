import { ApiProperty } from '@nestjs/swagger';
import { UpdateNotificationPreferenceDto } from '../notification-preference.dto';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSecretaryNotificationPreferenceDto extends UpdateNotificationPreferenceDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  applications?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  dailyPatientsList?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  turnRequests?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  derivationRequests?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  cancelledTurns?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ examples: ['false', 'true'] })
  commissions?: boolean;
}
