import {
  DeepPartial,
  EntityManager,
  FindManyOptions,
  InsertResult
} from 'typeorm';
import { BaseService } from './base.service';
import { ErrorManager } from '../exceptions/error.manager';
import { HttpStatus, Type } from '@nestjs/common';
import { NotificationPreference } from '../../domain/entities/notification-preference.entity';

export interface INotificationPreferencesService<
  T extends NotificationPreference,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>
> extends BaseService<T, CreateDto, UpdateDto> {
  getByUserId(userId: string): Promise<T[]>;
  getByUserIdIncludeDeletedWithManager(
    userId: string,
    entityManager: EntityManager
  ): Promise<T[]>;
  create(createDto: CreateDto): Promise<T>;
}

export function NotificationPreferencesServiceFactory<
  T extends NotificationPreference,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>
>(E: Type<T>): Type<INotificationPreferencesService<T, CreateDto, UpdateDto>> {
  //Servicio Base para las preferencias de notificaciones
  class NotificationPreferencesBaseService<
      T extends NotificationPreference,
      CreateDto extends DeepPartial<T>,
      UpdateDto extends DeepPartial<T>
    >
    extends BaseService<T, CreateDto, UpdateDto>
    implements INotificationPreferencesService<T, CreateDto, UpdateDto>
  {
    //método para obtener las preferencias de notificaciones de un usuario según su id
    async getByUserId(userId: string): Promise<T[]> {
      try {
        // const query = {
        //   where: {
        //     user: {
        //       id: userId
        //     }
        //   }
        // } as FindManyOptions<T>;
        // const result = await this.repository.find(query);

        // if (result?.length === 0) {
        //   throw new ErrorManager(
        //     `User's role does not match endpoint role`,
        //     HttpStatus.INTERNAL_SERVER_ERROR
        //   );
        // }

        return null;
      } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
      }
    }

    //método para obtener las preferencias de notificaciones de un usuario según su id
    async getByUserIdWithManager(
      userId: string,
      entityManager: EntityManager
    ): Promise<T[]> {
      try {
        const query = {
          where: {
            user: {
              id: userId
            }
          }
        } as FindManyOptions<any>;
        const result = await entityManager.find(E, query);

        if (result?.length === 0) {
          throw new ErrorManager(
            `User's role does not match endpoint role`,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }

        return result as any[];
      } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
      }
    }

    //método para obtener las preferencias de notificaciones de un usuario según su id, incluyendo registros con eliminación lógica
    async getByUserIdIncludeDeletedWithManager(
      userId: string,
      entityManager: EntityManager
    ): Promise<T[]> {
      try {
        const query = {
          where: {
            user: {
              id: userId
            }
          },
          withDeleted: true
        } as FindManyOptions<any>;
        const result = await entityManager.find(E, query);

        if (result?.length === 0) {
          throw new ErrorManager(
            `User's role does not match endpoint role`,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }

        return result;
      } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
      }
    }

    //sobrescribe el método create para utilizar con la creación de usuario
    override async create(
      createDto: CreateDto,
      entityManager?: EntityManager
    ): Promise<T> {
      try {
        if (!entityManager) {
          super.create(createDto);
        }
        const insertEntity: InsertResult = await entityManager.insert(
          E,
          createDto as any
        );
        const entityId = insertEntity.identifiers[0].id;
        const entity = await entityManager.findOne(E, {
          where: { id: entityId, deletedAt: null }
        });
        return entity as any;
      } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
      }
    }

    //sobrescribe el método soft remove para utilizar con la eliminación lógica de usuario
    override async softRemove(
      id: string,
      entityManager?: EntityManager
    ): Promise<string> {
      try {
        if (!entityManager) {
          super.softRemove(id);
        }
        const entity = await entityManager.findOne(E, {
          where: { id }
        } as FindManyOptions<any>); // Verifica que la entidad existe
        await entityManager.softRemove(E, entity); // Guarda la entidad con la nueva fecha de deletedAt
        return `Entity with id ${id} soft deleted`;
      } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
      }
    }

    override async restore(
      id: string,
      entityManager?: EntityManager
    ): Promise<T> {
      try {
        if (!entityManager) {
          super.restore(id);
        }
        const entity = await entityManager.findOne(E, {
          where: { id },
          withDeleted: true
        } as FindManyOptions<any>); // Busca la entidad por su id, siempre y cuando la entidad ya esté elimada, es decir, cuando el campo deletedAt sea diferente de null
        const restored = await entityManager.recover(E, entity);
        return restored;
      } catch (error) {
        throw ErrorManager.createSignatureError((error as Error).message);
      }
    }
  }

  return NotificationPreferencesBaseService;
}
