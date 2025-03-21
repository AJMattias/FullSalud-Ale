/* eslint-disable @typescript-eslint/no-unused-vars */
import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength
} from 'class-validator';
import { Filter } from '../../../common/util/dynamic-query-builder.util';
import { TransformQueryBoolean } from '../../../common/util/custom-dto-properties-decorators/transform-boolean-decorator.util';
import { Gender } from '../../enums';

export class PractitionerPaginationDto
  //extends PaginationDto
  //implements Filter
{
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  // @IsOptional()
  // @MaxLength(50)
  // license?: string;

  // @IsBoolean()
  // @TransformQueryBoolean('homeService')
  // @IsOptional()
  // homeService?: boolean;

  // @IsOptional()
  // @MaxLength(50)
  // name?: string;

  // @IsOptional()
  // @MaxLength(50)
  // lastName?: string;

  // @IsOptional()
  // @IsAlphanumeric()
  // dni?: string;

  // @IsOptional()
  // @IsEnum(Gender)
  // gender?: Gender;

  // @IsOptional()
  // @IsString()
  // @Type(() => String)
  // birth?: string;

  // @IsOptional()
  // degree?: string;

  // @IsOptional()
  // practitionerRole?: string;

  // @IsOptional()
  // socialWorkId?: string;
}
