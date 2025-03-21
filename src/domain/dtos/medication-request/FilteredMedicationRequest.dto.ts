import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsNumber, IsString } from 'class-validator';
import { CreateMedicationDto } from '../medication/medication.dto';
import { Transform, Type } from 'class-transformer';

export class FilteredMedicationRequestDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number =1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number=10;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Indicado para el alivio del dolor y la fiebre. / Tomar una cápsula cada 8 horas por 7 días.' })
  indications?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Infección respiratoria.' })
  diagnosis?: string;

  @IsBoolean()
  @ApiProperty({ example: false })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isValidSignature?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  practitionerId?: string; 

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  patientId?: string; 

  @IsOptional()
  @ApiProperty({ type: [CreateMedicationDto] })
  medicines?: CreateMedicationDto[]; 

  //nuevos atributos
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  prolonged_treatment?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  hiv?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Paracetamol' })
  generic_name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Tabletas recubiertas' })
  medicine_presentation?: string;
  
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Oral' })
  medicine_pharmaceutical_form?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 20 })
  medicine_quantity?: number;

}

//export class UpdateMedicationRequestDto extends PartialType(CreateMedicationRequestDto) {}
