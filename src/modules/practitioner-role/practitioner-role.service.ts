import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { CreatePractitionerRoleDto, UpdatePractitionerRoleDto } from '../../domain/dtos';
import { PractitionerRole } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';
import { ErrorManager } from '../../common/exceptions/error.manager';

@Injectable()
export class PractitionerRoleService extends BaseService<
  PractitionerRole,
  CreatePractitionerRoleDto,
  UpdatePractitionerRoleDto
> {
  constructor(
    @InjectRepository(PractitionerRole) protected specialityRepository: Repository<PractitionerRole>,
  ) {
    super(specialityRepository);
  }

  async createSpeciality(createSpecialityDto: CreatePractitionerRoleDto): Promise<PractitionerRole> {
    try {
      const newSpeciality = this.specialityRepository.create(createSpecialityDto);
      return await this.specialityRepository.save(newSpeciality);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getOne(id: string): Promise<PractitionerRole> {
    try {
      const speciality = await this.specialityRepository.findOne({
        where: { id, deletedAt: null },
        relations: ['tags'],
      });

      if (!speciality) {
        throw new NotFoundException(`Speciality with ID ${id} not found`);
      }

      return speciality;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async getAll(): Promise<PractitionerRole[]> {
    try {
      return await this.specialityRepository.find({
        where: { deletedAt: null },
        relations: ['tags'],
      });
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async updateSpeciality(id: string, updateSpecialityDto: UpdatePractitionerRoleDto): Promise<PractitionerRole> {
    try {
      const speciality = await this.getOne(id);

      Object.assign(speciality, updateSpecialityDto);
      return await this.specialityRepository.save(speciality);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      const speciality = await this.getOne(id);
      await this.specialityRepository.softRemove(speciality);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async recoverSpeciality(id: string): Promise<PractitionerRole> {
    try {
      const speciality = await this.specialityRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!speciality) {
        throw new NotFoundException(`Speciality with ID ${id} not found or not deleted`);
      }

      await this.specialityRepository.recover(speciality);
      return speciality;
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async removeWithManager(id: string, manager: EntityManager) {
    try {
      const entity = await manager.findOne(PractitionerRole, {
        where: { id },
      });
      await manager.remove(PractitionerRole, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async softRemoveWithManager(id: string, manager: EntityManager) {
    try {
      const entity = await manager.findOne(PractitionerRole, {
        where: { id },
      });
      await manager.softRemove(PractitionerRole, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }

  async restoreWithManager(id: string, manager: EntityManager): Promise<PractitionerRole> {
    try {
      const entity = await manager.findOne(PractitionerRole, {
        where: { id },
        withDeleted: true,
      });
      return await manager.recover(PractitionerRole, entity);
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
