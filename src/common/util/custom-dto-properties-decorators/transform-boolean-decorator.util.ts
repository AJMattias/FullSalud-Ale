import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ErrorManager } from '../../exceptions/error.manager';

/**
 * Agregar decorador para transformar un query param boolean de un dto correctamente
 * @param propertyName - El nombre de la propiedad que lleva el decorador
 * @returns Decorador Transform()
 */
export const TransformQueryBoolean = (propertyName: string) => {
  return applyDecorators(
    Transform(
      ({ value }) => {
        if (typeof value === 'boolean') return value;
        if (value === 'true') return true;
        if (value === 'false') return false;
        throw new ErrorManager(
          `${propertyName} should be a valid boolean value`,
          400
        );
      },
      {
        toClassOnly: true
      }
    )
  );
};
