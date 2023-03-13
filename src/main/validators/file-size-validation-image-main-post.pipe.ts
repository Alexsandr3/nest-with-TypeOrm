import { Injectable, PipeTransform } from '@nestjs/common';
import sharp, { Metadata } from 'sharp';
import { BadRequestExceptionMY } from '../helpers/My-HttpExceptionFilter';

@Injectable()
export class FileSizeValidationImageMainPostPipe implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>> {
  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    //default settings
    const contentTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const defaultSize = 100000; //Total size of image in bytes, for Stream and Buffer input only
    const defaultWidth = 940; //Number of pixels wide (EXIF orientation is not taken into consideration)
    const defaultHeight = 432; //Number of pixels high (EXIF orientation is not taken into consideration)
    //checking type
    const inputMimeType = image.mimetype.split(' ');
    if (image.size > defaultSize || !contentTypes.includes(inputMimeType[0])) {
      throw new BadRequestExceptionMY(`The file format is incorrect, please upload the correct file`);
    }
    //checking "width" and "height
    const metadata: Metadata = await sharp(image.buffer).metadata();
    if (metadata.width !== defaultWidth || metadata.height !== defaultHeight) {
      throw new BadRequestExceptionMY(`The file format is incorrect, please upload the correct file`);
    }
    //i need use in use case?
    // await reSizeImage(image.buffer, 156, 156);
    return image;
  }
}
