import { registerDecorator, ValidationOptions } from 'class-validator';
import { ArrayStringsValidatorService } from '../validators/array-strings-validator.service';

export function ArrayStrings(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'correctAnswers',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: ArrayStringsValidatorService,
    });
  };
}
