import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { ErrorManager } from '../../common/exceptions/error.manager';
import {
  CreatePractitionerSecretaryDto,
  UpdatePractitionerSecretaryDto
} from '../../domain/dtos';
import { PractitionerSecretary } from '../../domain/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PractitionerSecretaryService extends BaseService<
  PractitionerSecretary,
  CreatePractitionerSecretaryDto,
  UpdatePractitionerSecretaryDto
> {
  constructor(
    @InjectRepository(PractitionerSecretary)
    protected repository: Repository<PractitionerSecretary>
  ) {
    super(repository);
  }

  override async remove(id: string): Promise<string> {
    try {
      const entity = await this.findOne(id);
      return this.repository.manager.transaction(
        async (manager: EntityManager) => {
          if (entity) {
            await manager.delete(PractitionerSecretary, id);
            // await manager.delete(Specialist, entity);
            // await manager.delete(User, entity.person.user);
            return `Entity with id ${id} deleted`;
          }
        }
      );
    } catch (error) {
      throw ErrorManager.createSignatureError((error as Error).message);
    }
  }
}
