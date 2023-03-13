import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

//checking id from uri params
@ValidatorConstraint({ name: 'ArrayStrings' })
@Injectable()
export class ArrayStringsValidatorService implements ValidatorConstraintInterface {
  validate(value: any[]) {
    try {
      if (!Array.isArray(value)) return false;
      value.forEach((record) => {
        if (typeof record.trim() !== 'string' || record.trim().length === 0) return false;
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return "This array strings can't be empty and type  field should be string";
  }
}
