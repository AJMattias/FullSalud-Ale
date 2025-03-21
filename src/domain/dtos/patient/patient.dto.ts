import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';
import { UserDto } from '../user/user.dto';

export class CreatePatientDto extends OmitType(UserDto, ['role'] as const) {
  
  @ValidateNested()
  @Type(() => ShortBaseDto)
  @IsOptional()
  relationship?: ShortBaseDto;
}

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}