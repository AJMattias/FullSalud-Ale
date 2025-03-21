import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUUID,
  Length
} from 'class-validator';
import { PaginationDto } from '../../../common/dtos';
import { Filter } from '../../../common/util/dynamic-query-builder.util';

export class OrganizationPaginationDto extends PaginationDto implements Filter {
  @Length(11, 11)
  @IsNumberString()
  @IsOptional()
  @ApiProperty({
    description: 'Cuit de la institución, búsqueda exacta',
    example: '30701234567',
    type: 'string'
  })
  cuit?: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: 'Fracción o nombre completo de la institución',
    example: 'Centro Médico',
    type: 'string'
  })
  businessName?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Id del tipo de institución, búsqueda exacta',
    example: '5e139f43-891f-49e0-8fc1-8ca17d8fc6bf',
    type: 'string'
  })
  institutionType?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Id del iva de la institución, búsqueda exacta',
    example: 'e69dafe9-a546-496c-89bc-17c719d061f5',
    type: 'string'
  })
  iva?: string;

  /* @IsEnum(Day)
    @IsOptional()
    @ApiProperty({
        description: 'Día de atención, búsqueda exacta',
        type: Day,
    })
    day?: Day;
    
    @IsTime('fromHour')
    @IsNotEmpty()
    @ValidateIf(dto => dto.toHour || dto.fromHour)
    @ApiProperty({
        description: 'Hora fija o hora de inicio de rango horario para buscar institución que atienda en ese/esos horario/s. Formato HH:MM',
        example: '08:30',
        type: 'string',
    })
    fromHour?: string;

    @IsTime('toHour')
    @IsOptional()
    @ApiProperty({
        description: 'Hora de fin de rango horario para buscar institución que atienda en esos horarios, no puede pasarse sin una hora de inicio (toHour). Formato HH:MM',
        example: '12:45',
        type: 'string',
    })
    toHour?: string; */
}
