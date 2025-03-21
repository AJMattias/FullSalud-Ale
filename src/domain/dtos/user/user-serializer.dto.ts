import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { Gender, Role, DocumentType } from '../../enums';
import { SerializerSocialWorkEnrollmentDto } from '..';

export class SerializerUserDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'juan@gmail.com' })
  email: string;
  
  @Exclude()
  @ApiProperty({ example: 'password1234' })
  password: string;

  @Expose()
  @ApiProperty({ example: 'juan123' })
  username: string;

  @Expose()
  @ApiProperty({ example: false })
  googleBool: boolean;

  @Expose()
  @ApiProperty({ example: 'Juan' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Perez' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: [Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.RATHER_NOT_SAY] })
  gender: Gender;

  @Expose()
  @ApiProperty({ example: '2000-08-21' })
  birth: string;

  @Expose()
  @ApiProperty({ example: [DocumentType.DNI, DocumentType.PASSPORT] })
  documentType: DocumentType;

  @Expose()
  @ApiProperty({ example: '42.098.163' })
  dni: string;

  @Expose()
  @ApiProperty({ example: '2615836294' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'https://rybwefx6jybsfaoy.public.blob.vercel-storage.com/colapinto-z9UMp9pG9UAu6DZm3s1ajWCBJDpN9H.jpg' })
  urlImg: string;

  @Expose()
  @ApiProperty({
    example: Object.values(Role).join(' | ')
  })
  role: Role;

  @Expose()
  @Type(() => SerializerSocialWorkEnrollmentDto)
  @ApiProperty({ type: () => SerializerSocialWorkEnrollmentDto })
  socialWorkEnrollmentId?: SerializerSocialWorkEnrollmentDto;
}

export class SerializerShortUserDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'juan@example.com' })
  email: string;
}
