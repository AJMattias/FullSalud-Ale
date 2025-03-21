import {
  isDefined,
  isIn,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { UserDto } from '../../../domain/dtos';
import { Role } from '../../../domain/enums';

/**
 * Validation Arguments sobreescritos para el constraint personalizado
 */
class OmitFieldForRolesValidationArguments implements ValidationArguments {
  value: any;
  constraints: Role[]; //constraints pasa a ser un arreglo de Role
  targetName: string;
  object: UserDto; //object es un CreateUserDto
  property: string;
}

/**
 * Constraint para validar que una propiedad no este definida cuando se crea un rol que está en las constraints
 */
@ValidatorConstraint()
class OmitFieldForRolesValidatorConstraint
  implements ValidatorConstraintInterface
{
  validate(
    value: any,
    args?: OmitFieldForRolesValidationArguments
  ): Promise<boolean> | boolean {
    if (isDefined(value)) {
      return !isIn(args.object.role, args.constraints);
    }
    return true;
  }

  defaultMessage?(args?: OmitFieldForRolesValidationArguments): string {
    return `${args.property} should not exist when ${args.constraints.join(', ')} are created`;
  }
}

/**
 * Decorador para validar que el campo sea omitido al crear ciertos roles
 * @param props Arreglo de Role en los que no debe existir el campo
 * @param validationOptions
 * @returns
 */
export function OmitFieldForRoles(
  props: Role[],
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: props,
      validator: OmitFieldForRolesValidatorConstraint
    });
  };
}
