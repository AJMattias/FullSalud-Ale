import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateFinancialTransactionDto {
  @ApiProperty({ example: 15.5, description: 'Porcentaje de la comision' })
  @IsNumber()
  @IsNotEmpty()
  percentage: number;

  @ApiProperty({ example: 10, description: 'Minimo de pacientes' })
  @IsInt()
  @IsNotEmpty()
  minimunPatients: number;

  @ValidateNested()
  @Expose()
  @Type(() => ShortBaseDto)
  institutions?: ShortBaseDto[];
}

export class UpdateFinancialTransactionDto {
  @IsNumber()
  @IsOptional()
  percentage?: number;

  @IsInt()
  @IsOptional()
  minimunPatients?: number;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  institutions?: ShortBaseDto[];
}
