import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreateNotificationDto, UpdateNotificationDto } from '../../domain/dtos';
import { Notification } from '../../domain/entities';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class NotificationService extends BaseService<
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  constructor(
    @InjectRepository(Notification)
    protected repository: Repository<Notification>
  ) {
    super(repository);
  }

  // Eliminación lógica de las notificaciones de un usuario
  async softRemoveForUserWithManager(
    userId: string,
    entityManager: EntityManager
  ) {
    try {
      const notifications = await this.repository.find({
        where: { user: { id: userId } }
      }); // Obtiene las notificaciones del usuario

      await entityManager.softRemove(notifications); // Marca deletedAt
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Restauración lógica de las notificaciones de un usuario
  async restoreForUserWithManager(
    userId: string,
    entityManager: EntityManager
  ) {
    try {
      // Obtiene las notificaciones que tienen la misma fecha de eliminación del usuario para evitar restaurar aquellas que se han eliminado antes
      const notifications = await entityManager
        .createQueryBuilder(Notification, 'notification')
        .withDeleted() // Incluye las notificaciones y usuarios eliminados logicamente
        .leftJoinAndSelect('notification.user', 'user')
        .where('user.id = :userId', { userId })
        .andWhere('notification.deletedAt = user.deletedAt')
        .getMany();

      await entityManager.recover(notifications);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
