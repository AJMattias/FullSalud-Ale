import { ApiProperty } from '@nestjs/swagger';
import { ShortBaseDto } from '../../../common/dtos';
import { Medication } from '../../entities';
import { Expose, Type } from 'class-transformer';
import { CreateMedicationDto } from '../medication/medication.dto';
import { SerializerMedicationDto } from '../medication/medication-serializer.dto';
import { SerializerUserDto } from '../user/user-serializer.dto';
import { SerializerPatientDto } from '../patient/patient-serializer.dto';
import { SerializerPractitionerDto } from '../practitioner/practitioner-serializer.dto';

export class SerializerMedicationRequestDto extends ShortBaseDto {

  @Expose()
  @ApiProperty({ example: 'Tomar después de cada comida durante una semana' })
  indications: string;

  @Expose()
  @ApiProperty({ example: 'Faringitis aguda' })
  diagnosis: string;

  @Expose()
  @ApiProperty({ example: false })
  isValidSignature: boolean;

  @Expose()
  @Type(() => SerializerPractitionerDto)
  @ApiProperty({ type: [SerializerPractitionerDto] })
  practitioner: SerializerPractitionerDto;

  @Expose()
  @Type(() => SerializerPatientDto)
  @ApiProperty({ type: [SerializerPatientDto] })
  patient: SerializerPatientDto;

  @Expose()
  @Type(() => SerializerMedicationDto)
  @ApiProperty({ type: [SerializerMedicationDto] })
  medicines: SerializerMedicationDto[];

  @Expose()
  @ApiProperty({ example: true })
  prolonged_treatment: boolean;

  @Expose()
  @ApiProperty({ example: false })
  hiv: boolean;

  @Expose()
  @ApiProperty({ example: 'Paracetamol' })
  generic_name: string;

  @Expose()
  @ApiProperty({ example: 'Tabletas recubiertas' })
  medicine_presentation: string;
  
  @Expose()
  @ApiProperty({ example: 'Oral' })
  medicine_pharmaceutical_form: string;

  @Expose()
  @ApiProperty({ example: 20 })
  medicine_quantity: number;
}
