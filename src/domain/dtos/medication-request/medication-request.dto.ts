import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CreateMedicationDto } from '../medication/medication.dto';

export class CreateMedicationRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Indicado para el alivio del dolor y la fiebre. / Tomar una cápsula cada 8 horas por 7 días.' })
  indications: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Infección respiratoria.' })
  diagnosis: string;

  @IsBoolean()
  @ApiProperty({ example: false })
  isValidSignature: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  practitionerId: string; 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  patientId: string; 

  @IsNotEmpty()
  @ApiProperty({ type: [CreateMedicationDto] })
  medicines: CreateMedicationDto[]; 

  //nuevos atributos
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true })
  prolonged_treatment: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: false })
  hiv: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Paracetamol' })
  generic_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Tabletas recubiertas' })
  medicine_presentation: string;
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Oral' })
  medicine_pharmaceutical_form: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 20 })
  medicine_quantity: number;

}

export class UpdateMedicationRequestDto extends PartialType(CreateMedicationRequestDto) {}
