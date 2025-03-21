import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';
import { IsTime } from '../../../common/util/custom-dto-properties-decorators/validate-hour-decorator.util';
import { Day } from '../../enums';
import { CreateLocationWithIdDto } from '../location/location.dto';

export class CreatePractitionerAppointmentDto {
  @IsNotEmpty()
  @IsTime('startHour')
  @ApiProperty({ example: '09:00' })
  startHour: string;

  @IsNotEmpty()
  @IsTime('endHour')
  @ApiProperty({ example: '13:00' })
  endHour: string;

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

  //recibe opcionalmente el id de un especialista
  @IsOptional()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  practitioner: ShortBaseDto;

  //recibe opcionalmente el id de una oficina o una oficina nueva
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateLocationWithIdDto)
  office?: CreateLocationWithIdDto;
}

export class UpdatePractitionerAppointmentDto extends PartialType(
  CreatePractitionerAppointmentDto
) {}
