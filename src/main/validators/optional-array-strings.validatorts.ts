import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

//checking id from query params for sortTop
@ValidatorConstraint({ name: 'sortTop' })
@Injectable()
export class OptionalArrayStringsValidator implements ValidatorConstraintInterface {
  validate(value: any[]) {
    try {
      if (value === undefined) return true;
      if (typeof value === 'string') return true;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'This array strings can be empty and type field should be string';
  }
}
