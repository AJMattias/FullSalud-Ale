import { Base } from '../bases/base.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Type } from '@nestjs/common';

/**
 * Convierte una entidad en un DTO.
 * @param serializerDto - Clase que se usará para serializar las entidades en DTOs.
 * @param entity - Objeto de tipo `T` que representa la entidad a convertir en DTO.
 * @returns Un objeto DTO con las propiedades de la entidad, excluyendo las no expuestas.
 */
export function toDto<T extends Base, S>(serializerDto: Type<S>, entity: T): S {
  const plainEntity = instanceToPlain(entity);
  return plainToInstance(serializerDto, plainEntity, {
    strategy: 'excludeAll'
  });
}

/**
 * Convierte una lista de entidades en una lista de DTOs.
 * @param serializerDto - Clase que se usará para serializar las entidades en DTOs.
 * @param entities - Array de objetos de tipo `T` que representa las entidades a convertir en DTOs.
 * @returns Un array de objetos de tipo `S`, transformados de entidades a DTOs, excluyendo las propiedades no expuestas.
 */
export function toDtoList<T extends Base, S>(
  serializerDto: Type<S>,
  entities: T[]
): S[] {
  const plainEntities = instanceToPlain(entities);
  return plainToInstance(serializerDto, plainEntities, {
    strategy: 'excludeAll'
  }) as S[];
}
