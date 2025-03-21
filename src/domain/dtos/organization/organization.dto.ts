import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(11, 11)
  @ApiProperty({ example: '30701234567' })
  cuit: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  //recibe el id de iva seleccionado
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  iva?: ShortBaseDto;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  @ValidateNested()
  commissions: ShortBaseDto[];

  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  @ValidateNested()
  institutionType: ShortBaseDto;
}
export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
