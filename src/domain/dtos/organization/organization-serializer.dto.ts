import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { SerializerInstitutionTypeDto, SerializerValueAddedTaxDto } from '..';

export class SerializerOrganizationDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '30701234567' })
  cuit: string;

  @Expose()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  @Expose()
  @Type(() => SerializerValueAddedTaxDto)
  iva: SerializerValueAddedTaxDto;

  @Expose()
  @Type(() => SerializerInstitutionTypeDto)
  institutionType: SerializerInstitutionTypeDto;
}

export class SerializerShortInstitutionDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  @Expose()
  @Type(() => SerializerInstitutionTypeDto)
  institutionType: SerializerInstitutionTypeDto;
}
