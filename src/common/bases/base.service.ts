import { Base } from './base.entity';
import { DeepPartial, Repository } from 'typeorm';
import { PaginationDto } from '../dtos/pagination-common.dto';
import {
  getPagingData,
  PaginationMetadata
} from '../util/pagination-data.util';
import { ErrorManager } from '../exceptions/error.manager';

export abstract class BaseService<
  T extends Base,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>
> {
  constructor(protected readonly repository: Repository<T>) {}

  // Busca una entidad (deletedAt: null) por id, devuelve error si no la encuentra
  async findOne(id: string): Promise<T> {
    try {
      const entity = await this.repository.findOne({
        where: { id, deletedAt: null }
      } as any); // Busca la entidad por el id
      if (!entity) {
        // Si 'entity' es null, devuelve una excepción
        throw new ErrorManager(`Entity with id ${id} not found`, 404);
      }
      return entity;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Guarda una entidad en la base de datos
  async create(createDto: CreateDto): Promise<T> {
    try {
      const savedEntity = await this.repository.save(createDto);
      return await this.findOne(savedEntity.id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Retorna todas las entidades (deletedAt: null) paginadas
  async findAll(
    paginationDto: PaginationDto
  ): Promise<{ data: T[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;

      const entities = await this.repository.find({
        skip: (page - 1) * limit,
        take: limit,
        where: { deletedAt: null }
      });

      return {
        data: entities,
        meta: getPagingData(entities, page, limit)
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Retorna todas las entidades paginadas, incluidas las eliminadas
  async findAllIncludeDeletes(
    paginationDto: PaginationDto
  ): Promise<{ data: T[]; meta: PaginationMetadata }> {
    try {
      const { page, limit } = paginationDto;

      const entities = await this.repository.find({
        skip: (page - 1) * limit,
        take: limit,
        withDeleted: true
      });

      return {
        data: entities,
        meta: getPagingData(entities, page, limit)
      };
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Actualización de una entidad; si no la encuentra, retorna error
  async update(id: string, updateDto: UpdateDto): Promise<T> {
    try {
      // Busca la entidad
      const entity = await this.findOne(id);
      // Combina las propiedades del DTO con la entidad existente.
      const updatedEntity = Object.assign(entity, updateDto);
      // Guarda
      await this.repository.save(updatedEntity);
      // Recuperar la entidad actualizada
      return await this.findOne(id);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Eliminación lógica de una entidad
  async softRemove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id); // Verifica que la entidad existe
      await this.repository.softRemove(entity); // Marca deletedAt
      return `Entity with id ${id} soft deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Eliminación física de una entidad
  async remove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id); // Verifica que la entidad existe
      await this.repository.remove(entity); // Si existe la elimina, si no devuelve una excepción
      return `Entity with id ${id} deleted`;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  // Restauración lógica de una entidad
  async restore(id: string): Promise<T> {
    try {
      // Busca la entidad por su id donde  el campo deletedAt sea diferente a null
      const entity = await this.repository.findOne({
        where: { id },
        withDeleted: true
      } as any);

      // Si 'entity' es null, devuelve una excepción como que la entidad no existe o no ha sido eliminada anteriormente
      if (!entity) {
        throw new ErrorManager(`Entity with id ${id} not found`, 404);
      }

      return this.repository.recover(entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
