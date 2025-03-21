import { Expose } from 'class-transformer';
import { ShortBaseDto } from 'src/common/dtos';
import { Gender } from 'src/domain/enums';
import { SerializerPractitionerRoleDto } from '../practitioner-role/practitioner-role-serializer.dto';
import { SerializerSocialWorkEnrollmentDto } from '../social-work-enrollment/social-work-enrollment-serializer.dto';
import { SerializerLocationDto } from '../location/Location-serializer.dto';
import { SerializerAppointmentDto } from '../appointment/Appointment-serializer.dto';

export class PractitionerRequestDto
   extends ShortBaseDto
{
  @Expose()
  license?: string;
  
  @Expose()
  homeService?: boolean;

  @Expose()
  name?: string;

  @Expose()
  lastName?: string;

  @Expose()
  dni?: string;

  @Expose()
  gender?: Gender;

  @Expose()
  birth?: string;

  @Expose()
  degree?: string;

  @Expose()
  speciality?: SerializerPractitionerRoleDto;

  @Expose()
  socialWorkEnrollmentId?: SerializerSocialWorkEnrollmentDto;

  @Expose()  
  officeName: SerializerLocationDto;

  @Expose()
  appointmentDay: SerializerAppointmentDto[];
}
