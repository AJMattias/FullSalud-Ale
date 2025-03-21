import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Express } from 'express';
import 'multer';
import { Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AppointmentStatus } from '../../enums';
import { IsTime } from '../../../common/util/custom-dto-properties-decorators/validate-hour-decorator.util';
import { IncompatableWith } from '../../../common/util/custom-dto-properties-decorators/validate-incompatible-properties.util';
import { CreatePatientAppointmentDto } from '../patient-appointment/patient-appointment.dto';
import { CreatePatientDto } from '../patient/patient.dto';

export class CreateAppointmentDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  date?: string;

  @IsOptional()
  hour?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientAppointmentDto)
  patientAppointment?: CreatePatientAppointmentDto[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'dolor de pecho opresivo que se irradia hacia el brazo izquierdo, dificultad para respirar y sudoración excesiva'
  })
  observation?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '20a05b0e-d872-4fe5-bf9f-4b6b010b443d' })
  patientId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePatientDto)
  @ApiProperty({
    example: {
      documentType: '56895458',
      dni: '12345678',
      name: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@gmail.com',
      phone: '123456789',
    },
  })
  patient?: CreatePatientDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ShortBaseDto)
  @ApiProperty({
    example: [{ id: '7c715f1e-09b9-4138-814a-00959681b541' }],
    type: [ShortBaseDto],
  })
  practitionerIds: ShortBaseDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  diagnostic?: ShortBaseDto;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  @ApiProperty({
    examples: [
      AppointmentStatus.APPROVED,
      AppointmentStatus.CANCELLED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
      AppointmentStatus.PENDING,
      AppointmentStatus.UNDER_REVIEW
    ]
  })
  status?: AppointmentStatus;
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  @ApiProperty({
    examples: [
      AppointmentStatus.APPROVED,
      AppointmentStatus.CANCELLED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
      AppointmentStatus.PENDING,
      AppointmentStatus.UNDER_REVIEW
    ]
  })
  status?: AppointmentStatus;
}

export class CreateTurnDtoWithFiles {
  @ValidateNested()
  @Type(() => CreateAppointmentDto)
  @ApiProperty({ type: CreateAppointmentDto })
  turn?: CreateAppointmentDto;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Imagénes de derivaciones en formato PNG, JPG o JPEG'
  })
  derivationImages?: Express.Multer.File[];
}

export class TimeDTO {
  appointment_hour: string
  consultationtime: string
}