import { DeepPartial } from 'typeorm';
import { Body, Get, Param, ParseUUIDPipe, Patch, Type } from '@nestjs/common';
import { AbstractValidationPipe } from '../pipes/abstract-validation.pipe';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger';
import { ShortBaseDto } from '../dtos/base-short.dto';
import { toDto, toDtoList } from '../util/transform-dto.util';
import { INotificationPreferencesService } from '../bases/i-notification-preference-base.service';
import { NotificationPreference } from '../../domain/entities/notification-preference.entity';

export interface INotificationBaseController<
  T extends NotificationPreference,
  U extends DeepPartial<T>,
  S extends DeepPartial<T>,
  ShortS extends DeepPartial<T>
> {
  update(id: string, updateDto: U): Promise<S>;
  getByUserId(id: string): Promise<ShortS[]>;
}

export function NotificationPreferencesControllerFactory<
  T extends NotificationPreference,
  U extends DeepPartial<T>,
  S extends DeepPartial<T>,
  ShortS extends DeepPartial<T>
>(
  updateDto: Type<U>,
  serializerDto: Type<S>,
  shortSerializerDto: Type<ShortS>
): Type<INotificationBaseController<T, U, S, ShortS>> {
  //pipe para validar el update dto
  const updatePipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: updateDto }
  );

  //Controlador Base para las preferencias de notificaciones
  @ApiExtraModels(ShortBaseDto)
  @ApiBadRequestResponse({ description: 'Error: Bad Request' })
  class NotificationPreferencesBaseController<
    T extends NotificationPreference,
    C extends DeepPartial<T>,
    U extends DeepPartial<T>,
    S extends DeepPartial<T>,
    ShortS extends DeepPartial<T>
  > implements INotificationBaseController<T, U, S, ShortS>
  {
    protected service: INotificationPreferencesService<T, C, U>;

    @Patch(':id')
    @ApiBody({
      type: updateDto
    })
    @ApiOperation({
      description: 'Actualizar preferencias de notificaciones'
    })
    @ApiNotFoundResponse({
      description: 'Record not found'
    })
    @ApiOkResponse({
      description: 'Record updated successfully',
      type: serializerDto
    })
    async update(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body(updatePipe) updateDto: U
    ): Promise<S> {
      const entity = await this.service.update(id, updateDto);
      return toDto(serializerDto, entity) as unknown as S;
    }

    @Get(':id')
    @ApiOperation({
      description:
        'Obtener las preferencias de notificaciones correspondientes a un usuario mediante el id del mismo'
    })
    @ApiNotFoundResponse({
      description: 'Records not found'
    })
    @ApiOkResponse({
      description: 'Records found',
      type: [shortSerializerDto]
    })
    @ApiInternalServerErrorResponse({
      description: "User's role does not match endpoint role"
    })
    async getByUserId(
      @Param('id', new ParseUUIDPipe()) id: string
    ): Promise<ShortS[]> {
      const entities = await this.service.getByUserId(id);
      return toDtoList(shortSerializerDto, entities) as unknown as ShortS[];
    }
  }

  return NotificationPreferencesBaseController;
}
