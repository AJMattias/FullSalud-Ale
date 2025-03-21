import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ShortBaseDto } from '../../../common/dtos';

export class SerializerClinicalIndicationDetailDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'Orden de la medicacion' })
  order: number;

  @Expose()
  @ApiProperty({ example: 500, description: 'TLa dosis para la medicacion' })
  dose: string;

  @Expose()
  @ApiProperty({
    example: 8,
    description: 'Periodo de dias en que se tomara la medicacion'
  })
  period: number;

  @Expose()
  @ApiProperty({
    example: 24,
    description: 'Cada cuantas horas se tomara la medicacion'
  })
  timeLapse: number;
}
