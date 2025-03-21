import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from '../../domain/dtos';
import { Prescription, Practitioner } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PrescriptionService extends BaseService<
  Prescription,
  CreatePrescriptionDto,
  UpdatePrescriptionDto
> {
  constructor(
    @InjectRepository(Prescription)
    protected repository: Repository<Prescription>
  ) {
    super(repository);
  }

  //sobrescribe el método base create para añadir validación si el especialista puede prescribir
  override async create(
    createDto: CreatePrescriptionDto
  ): Promise<Prescription> {
    try {
      return await this.repository.manager.transaction(
        async (entityManager: EntityManager) => {
          const specialist: Practitioner = await entityManager.findOne(Practitioner, {
            where: { id: createDto.practitioner.id },
            relations: ['specialities'], // Asegúrate de incluir la relación
          });
  
          if (!specialist || !specialist.specialities || specialist.specialities.length === 0) {
            throw new ErrorManager(
              'Specialist does not have any specialities assigned',
              HttpStatus.BAD_REQUEST
            );
          }
  
          if (specialist.specialities.some((speciality) => speciality.canPrescribe)) {
            if (!createDto.indications && !createDto.observations) {
              throw new ErrorManager(
                'Either indications field or observations field must not be empty',
                HttpStatus.BAD_REQUEST
              );
            }
          } else {
            if (createDto.indications) {
              throw new ErrorManager(
                'Specialist is not authorized to prescribe medicine',
                HttpStatus.BAD_REQUEST
              );
            } else if (!createDto.observations) {
              throw new ErrorManager(
                'Observations field must not be empty',
                HttpStatus.BAD_REQUEST
              );
            }
          }
  
          const newPrescription = entityManager.create(Prescription, createDto);
          return await entityManager.save(newPrescription);
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
  
}
