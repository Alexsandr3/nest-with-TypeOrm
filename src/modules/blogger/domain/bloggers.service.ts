import { Injectable } from '@nestjs/common';
import { UploadImageBlogCommand } from '../application/use-cases/upload-image-blog.command';
import path from 'node:path';
import fs from 'node:fs';
import { ensureDirSync, saveFileAsync } from '../../../utils/fs-utils';

@Injectable()
export class BloggersService {
  constructor() {}

  async execute(userId: string, originalname: string, buffer: Buffer) {
    const pathDir = path.join('photos', 'users', userId, originalname);
    ensureDirSync(pathDir);
    // await saveFileAsync(pathDir, photo);
    // const pathDir = path.join('-------photos', 'wallpaper-blog', '3');
    // await ensureDirSync(pathDir);
    // await saveFileAsync(pathDir, photoFile.originalname, photoFile.buffer);

    return;
  }

  async delete(fileId: string) {
    await fs.unlinkSync(fileId);
  }
}
