import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Day } from '../../enums';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsTime } from '../../../common/util/custom-dto-properties-decorators/validate-hour-decorator.util';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateAppointmentSlotDto {
  @IsNotEmpty()
  @IsTime('openingHour')
  @ApiProperty({ example: '09:00' })
  openingHour: string;

  @IsNotEmpty()
  @IsTime('closeHour')
  @ApiProperty({ example: '13:30' })
  closeHour: string;

  @IsNotEmpty()
  @IsEnum(Day)
  @ApiProperty({
    examples: [
      Day.SUNDAY,
      Day.MONDAY,
      Day.TUESDAY,
      Day.WEDNESDAY,
      Day.THURSDAY,
      Day.FRIDAY,
      Day.SATURDAY
    ]
  })
  day: Day;

  @ValidateNested()
  @IsOptional()
  @Type(() => ShortBaseDto)
  headquarters?: ShortBaseDto;
}

export class UpdateAppointmentSlotDto extends PartialType(
  CreateAppointmentSlotDto
) {
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  id?: string;
}
