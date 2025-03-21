import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../../common/factories/controller.factory';
import {
  CreateBranchDto,
  SerializerBranchDto,
  UpdateBranchDto
} from '../../domain/dtos';
import { Branch } from '../../domain/entities';
import { BranchService } from './branch.service';

@ApiTags('Branch')
@Controller('branch')
export class BranchController extends ControllerFactory<
  Branch,
  CreateBranchDto,
  UpdateBranchDto,
  SerializerBranchDto
>(
  Branch,
  CreateBranchDto,
  UpdateBranchDto,
  SerializerBranchDto
) {
  constructor(protected service: BranchService) {
    super();
  }
}
