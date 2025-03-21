import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEnum,
  //IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  //IsUUID,
  MaxLength
} from 'class-validator';
import { Filter } from '../../../common/util/dynamic-query-builder.util';
import { TransformQueryBoolean } from '../../../common/util/custom-dto-properties-decorators/transform-boolean-decorator.util';
import { Gender } from '../../enums';

export class PractitionerFilteredPaginationDto
  // extends PaginationDto
   implements Filter
{
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  //@IsNotEmpty()
  @MaxLength(50)
  license?: string;

  @IsBoolean()
  @TransformQueryBoolean('homeService')
  @IsOptional()
  homeService?: boolean;

  @IsOptional()
  //@IsNotEmpty()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  //@IsNotEmpty()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  //@IsNotEmpty()
  @IsAlphanumeric()
  dni?: string;

  @IsOptional()
  //@IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  //@IsNotEmpty()
  @IsString()
  @Type(() => String)
  birth?: string;

  @IsOptional()
  //@IsNotEmpty()
  //@IsUUID()
  degree?: string;

  @IsOptional()
  //@IsNotEmpty()
  //@IsUUID()
  speciality?: string;

  @IsOptional()
  //@IsUUID()
  //@IsNotEmpty()
  socialWorkEnrollmentId?: string;
  
  @IsOptional()
  officeName: string;

  @IsOptional()
  appointmentDay: string;
}
