import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';
import { CreateAddressWithIdDto, CreateAppointmentSlotDto } from '..';

export class CreateBranchDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '30701234567' })
  cuit: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456789' })
  phone: string;

  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  @ValidateNested()
  user: ShortBaseDto;

  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  @ValidateNested()
  institution: ShortBaseDto;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => CreateAddressWithIdDto)
  @ValidateNested()
  address: CreateAddressWithIdDto;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: 'false',
    description: 'Marca a una sede como principal'
  })
  isMainBranch: boolean;

  @ValidateNested()
  @IsOptional()
  @Type(() => CreateAppointmentSlotDto)
  attentionHours?: CreateAppointmentSlotDto[];
}

export class UpdateBranchDto extends PartialType(
  OmitType(CreateBranchDto, ['user', 'institution'] as const)
) {}
