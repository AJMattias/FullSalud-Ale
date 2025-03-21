import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateSocialWorkDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'OSEP' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2564859874' })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'https://osepmendoza.com.ar/web/' })
  website?: string;

}

export class UpdateSocialWorkDto extends PartialType(CreateSocialWorkDto) {}
