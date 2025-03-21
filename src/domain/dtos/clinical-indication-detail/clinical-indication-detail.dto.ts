import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateClinicalIndicationDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  order: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 500, description: 'La dosis para la medicacion' })
  dose: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 8,
    description: 'Periodo de dias en que se tomara la medicacion'
  })
  period: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 24,
    description: 'Cada cuantas horas se tomara la medicacion'
  })
  timeLapse: number;
}

export class UpdateIndicationDetailDto extends PartialType(
  CreateClinicalIndicationDetailDto
) {}
