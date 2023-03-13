import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestExceptionMY, NotFoundExceptionMY } from '../helpers/My-HttpExceptionFilter';
import { isUUID } from 'class-validator';

//checking id from uri params
@Injectable()
export class ValidateUuidPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isUUID(value)) {
      throw new NotFoundExceptionMY(`Incorrect id,  please enter a valid one`);
    }
    return value;
  }
}

@Injectable()
export class ValidateUuidPipeFor404Error implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!isUUID(value)) {
      throw new BadRequestExceptionMY(`Incorrect id,  please enter a valid one`);
    }
    return value;
  }
}
