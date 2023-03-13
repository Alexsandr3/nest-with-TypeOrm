import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestExceptionMY } from '../helpers/My-HttpExceptionFilter';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const contentTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const inputMimeType = value.mimetype.split(' ');
    if (value.size > 100000 || !contentTypes.includes(inputMimeType[0])) {
      throw new BadRequestExceptionMY(`The file format is incorrect, please upload the correct file`);
    }

    return value;
  }
}
