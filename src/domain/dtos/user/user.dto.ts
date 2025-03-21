import { Role } from '../../enums/role.enum';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  MaxLength,
  ValidateNested
} from 'class-validator';
import 'multer';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptionalIf } from '../../../common/util/custom-dto-properties-decorators/validate-is-optional-if-decorator.util';
import { ShortBaseDto } from '../../../common/dtos';
import { Gender } from '../../enums';
import { DocumentType } from '../../enums';
import { Type } from 'class-transformer';

export class UserDto {

  @IsUUID()
  @IsOptional()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @IsOptional()
  @ApiProperty({ example: 'juan123' })
  username: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      //maxLength: 20,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one upper case letter, one lower case letter, one number, and zero special character(@$!%*?&)'
    }
  )
  @MaxLength(20, {
    message: 'Password must be at most 20 characters long'
  })
  //si se crea secretary, patient o institution, la contraseña es opcional
  @IsOptionalIf(
    (dto) =>
      dto.role == Role.INSTITUTION ||
      dto.role == Role.SECRETARY ||
      dto.role == Role.PATIENT
  )
  @ApiProperty({ example: 'Clave1*' })
  password?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  googleBool?: boolean;

  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({
    examples: [Role.PATIENT, Role.ADMIN, Role.INSTITUTION, Role.SPECIALIST]
  })
  role: Role;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'David' })
  name?: string | null;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Peréz' })
  lastName?: string;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({
    examples: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.RATHER_NOT_SAY],
  })
  gender?: Gender;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2000-08-21' })
  birth?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'https://rybwefx6jybsfaoy.public.blob.vercel-storage.com/colapinto-z9UMp9pG9UAu6DZm3s1ajWCBJDpN9H.jpg' })
  urlImg?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  @ApiProperty({ examples: [DocumentType.DNI, DocumentType.PASSPORT] })
  documentType?: DocumentType;

  @IsOptional()
  @IsString()
  @ApiProperty({ examples: ['42.098.163', 'A0123456'] })
  dni?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2615836294' })
  phone?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ShortBaseDto)
  @ApiProperty({ type: [ShortBaseDto] })
  addresses?: ShortBaseDto[];

  @IsOptional()
  @IsUUID()
  socialWorkEnrollmentId?: string;

}

export class AuthUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'juan@example.com', required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'juan123', required: false })
  username?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Clave1*' })
  password: string;

  
}

//"reescribe" profile image, no permite actualizar rol
export class UpdateUserDto extends PartialType(
  OmitType(UserDto, [
    'role',
    'username',
    'password'
  ] as const)
) {
  // @IsNumberString()
  // 
  // @ApiProperty({ example: '2615836294' })
  // phone?: string;

  @IsString()

  @IsOptional()
  @ApiProperty({ example: 'juan123' })
  username?: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      //maxLength: 20,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0 
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one upper case letter, one lower case letter, one number, and zero special character(@$!%*?&)'
    }
  )
  @MaxLength(20, {
    message: 'Password must be at most 20 characters long'
  })
  @ApiProperty({ example: 'Clave1*' })
  password?: string;

}

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'juan@example.com', required: false })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'juan123', required: false })
  username?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Clave1*' })
  password: string;

}
