import { Module } from '@nestjs/common';
import { AppointmentSlotService } from './appointment-slot.service';
import { AppointmentSlotController } from './appointment-slot.controller';
import { AppointmentSlot  } from '../../domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentSlot ])],
  controllers: [AppointmentSlotController],
  providers: [AppointmentSlotService]
})
export class AppointmentSlotModule {}
