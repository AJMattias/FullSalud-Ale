import { FullBaseDto } from '../../../common/dtos';
import {
  SerializerClinicalIndicationDto,
  SerializerShortPatientDto,
  SerializerShortPractitionerDto
} from '..';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class SerializerPrescriptionDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '1970-12-07' })
  date: string;

  @Expose()
  @Type(() => SerializerShortPatientDto)
  patient: SerializerShortPatientDto;

  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  practitioner: SerializerShortPractitionerDto;

  @Expose()
  @Type(() => SerializerClinicalIndicationDto)
  indications: SerializerClinicalIndicationDto[];
}
export class SerializerShortPrescriptionDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '1970-12-07' })
  date: string;

  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  patientTurn: SerializerShortPractitionerDto;

  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  practitioner: SerializerShortPractitionerDto;
}
