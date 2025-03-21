import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Practitioner, User } from '../../domain/entities';
import { AuthController } from './auth.controller';
// import { PatientsNotificationPreferencesModule } from '../patients_notification_preferences/patients-notification-preferences.module';
// import { SpecialistsNotificationPreferencesModule } from '../specialists_notification_preferences/specialists-notification-preferences.module';
// import { InstitutionsNotificationPreferencesModule } from '../institutions_notification_preferences/institutions-notification-preferences.module';
// import { AdminsNotificationPreferencesModule } from '../admins_notification_preferences/admins-notification-preferences.module';
// import { SecretaryNotificationPreferencesModule } from '../secretary_notification_preferences/secretary-notification-preferences.module';
// import { SpecialistsSecretaryNotificationPreferencesModule } from '../specialists_secretary_notification_preferences/specialists-secretary-notification-preferences.module';
// import { NotificationsModule } from '../notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from '../../config/envs';
import { GoogleStrategy } from './config/google.strategy';


@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envConfig.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    TypeOrmModule.forFeature([User, Practitioner, Patient]),
    // PatientsNotificationPreferencesModule,
    // SpecialistsNotificationPreferencesModule,
    // InstitutionsNotificationPreferencesModule,
    // AdminsNotificationPreferencesModule,
    // SecretaryNotificationPreferencesModule,
    // SpecialistsSecretaryNotificationPreferencesModule,
    // NotificationsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService]
})
export class AuthModule {}
