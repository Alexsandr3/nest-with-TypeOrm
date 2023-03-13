import sharp from 'sharp';

export async function reSizeImage(inputPath: Buffer, width: number, height: number): Promise<Buffer> {
  try {
    return await sharp(inputPath).resize(width, height).toBuffer();
  } catch (e) {
    console.error(`Error resizing image: ${e}`);
  }
}
