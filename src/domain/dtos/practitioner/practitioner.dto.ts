import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  CreatePractitionerAppointmentDto,
  UpdatePractitionerAppointmentDto,
} from '..';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';

export class CreatePractitionerDto extends OmitType(UserDto, ['role'] as const) {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '123456' })
  license?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'f0d50580-e7ca-4860-ba4e-7c4809153ae7' })
  degreeId?: string;

  @ValidateNested({ each: true })
  @Type(() => ShortBaseDto)
  @IsOptional()
  @ApiProperty({ type: [ShortBaseDto] })
  specialities?: ShortBaseDto[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  homeService?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  acceptedSocialWorks?: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreatePractitionerAppointmentDto)
  @IsOptional()
  @ApiProperty({ type: [CreatePractitionerAppointmentDto] })
  specialistAttentionHour?: CreatePractitionerAppointmentDto[];

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '00:30' })
  consultationTime: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  officeId?: string;

}

export class UpdatePractitionerDto extends PartialType(OmitType(CreatePractitionerDto, ['specialistAttentionHour'])) {
  @ValidateNested({ each: true })
  @Type(() => UpdatePractitionerAppointmentDto)
  @IsOptional()
  @ApiProperty({ type: [UpdatePractitionerAppointmentDto] })
  specialistAttentionHour?: UpdatePractitionerAppointmentDto[];
}
