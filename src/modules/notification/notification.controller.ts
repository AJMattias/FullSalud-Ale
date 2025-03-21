import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ControllerFactory } from '../../common/factories/controller.factory';
import { Notification } from '../../domain/entities';
import {
  CreateNotificationDto,
  SerializerNotificationDto,
  UpdateNotificationDto
} from '../../domain/dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController extends ControllerFactory<
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
  SerializerNotificationDto
>(
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
  SerializerNotificationDto
) {
  constructor(private readonly service: NotificationService) {
    super();
  }
}
