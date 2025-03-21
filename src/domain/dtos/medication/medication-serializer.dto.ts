import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FullBaseDto } from '../../../common/dtos';

export class SerializerMedicationDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Medication' })
  resourceType?: string = 'Medication';
  @Expose()
  @ApiProperty({ example: 'Ibuprofeno', description: 'Nombre del medicamento' })
  name: string;
  @Expose()
  @ApiProperty({ example: 'Ibuprofeno', description: 'Nombre del medicamento' })
  description: string;
}
