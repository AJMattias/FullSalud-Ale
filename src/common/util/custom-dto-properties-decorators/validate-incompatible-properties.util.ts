import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
  isDefined,
  ValidateIf
} from 'class-validator';

/**
 * Define una restricción para validar la existencia de ciertas propiedades en un dto
 * al mismo tiempo que otra propiedad
 */
@ValidatorConstraint({ async: false })
class IsNotSiblingOfConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (isDefined(value)) {
      return this.getFailedConstraints(args).length === 0;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} cannot exist alongside the following defined properties: ${this.getFailedConstraints(args).join(', ')}`;
  }

  getFailedConstraints(args: ValidationArguments) {
    return args.constraints.filter((prop) => isDefined(args.object[prop]));
  }
}

/**
 * Crea decorador para validar si existen ciertas propiedades en un dto al mismo tiempo
 * que la propiedad a la que se aplica decorador
 * @param props Nombre de la/s propiedad/es que no pueden existir cuando la propiedad existe
 * @param validationOptions Opciones para la validación
 * @returns Un decorador customizado
 */
function IsNotSiblingOf(
  props: string[],
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: props,
      validator: IsNotSiblingOfConstraint
    });
  };
}

/**
 * Función para determinar si proceder con la valiación de una propiedad
 * @param incompatibleSiblings
 * @returns
 */
export function incompatibleSiblingsNotPresent(incompatibleSiblings: string[]) {
  return function (object: any, value: any) {
    return Boolean(
      isDefined(value) || // Validate if prop has value
        incompatibleSiblings.every((prop) => !isDefined(object[prop])) // Validate if all incompatible siblings are not defined
    );
  };
}

/**
 * Añade decoradores necesarios para validar que una propiedad no exista al mismo tiempo que otra/s
 * @param incompatibleSiblings Nombre de la/s propiedad/es que no puede existir al mismo cuando la propiedad con el decorador existe
 * @returns Decoradores IsNotSibilingOf y ValidateIf
 */
export function IncompatableWith(incompatibleSiblings: string[]) {
  const notSibling = IsNotSiblingOf(incompatibleSiblings);
  const validateIf = ValidateIf(
    incompatibleSiblingsNotPresent(incompatibleSiblings)
  );
  return function (target: any, key: string) {
    notSibling(target, key);
    validateIf(target, key);
  };
}
