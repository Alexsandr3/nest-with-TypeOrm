import { registerDecorator, ValidationOptions } from 'class-validator';
import { OptionalArrayStringsValidator } from '../validators/optional-array-strings.validatorts';

export function OptionalArrayStrings(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'sortTop',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: OptionalArrayStringsValidator,
    });
  };
}
