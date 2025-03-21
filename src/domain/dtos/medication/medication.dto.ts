import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateMedicationDto extends ShortBaseDto {
  @IsString()
  @ApiProperty({ example: 'Ibuprofeno', description: 'Nombre del medicamento' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'droga desinflamatoria, tomar cada 8h', description: ' Descripción detallada de la medicina, su uso o indicaciones.' })
  description?: string;
}

export class UpdateMedicationDto extends PartialType(CreateMedicationDto) { }
