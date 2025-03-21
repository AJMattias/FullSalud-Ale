import { applyDecorators } from '@nestjs/common';
import { Matches } from 'class-validator';
/**
 * Agregar decorador para validar que un string tenga formato HH:MM de 24 hs
 * @param property - El nombre de la propiedad que lleva el decorador
 * @returns Decorador Matches regex ([01]?[0-9]|2[0-3]):[0-5][0-9]
 */
export const IsTime = (property: string) => {
  return applyDecorators(
    Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: `${property} must match HH:MM regular expression`
    })
  );
};
