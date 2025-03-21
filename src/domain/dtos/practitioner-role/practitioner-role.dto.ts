import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreatePractitionerRoleDto {
  
  @IsString()
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  canPrescribe?: boolean;

  @ArrayUnique()
  @IsOptional()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  tags?: ShortBaseDto[];
}

export class UpdatePractitionerRoleDto extends PartialType(CreatePractitionerRoleDto) {
  @ArrayUnique()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  tags?: ShortBaseDto[];
}
