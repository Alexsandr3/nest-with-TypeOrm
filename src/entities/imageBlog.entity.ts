import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import sharp, { Metadata } from 'sharp';
import { Blog } from './blog.entity';

@Entity()
export class ImageBlog {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  blogId: string;
  @Column({ type: 'uuid' })
  userId: string;

  //---image 156x156 -----------
  @Column({ type: 'character varying', default: null })
  keyImageMain: string;
  @Column({ type: 'int', default: null })
  sizeMainImage: number;
  @Column({ type: 'character varying', default: null })
  fieldIdImageMain: string;
  @Column({ type: 'timestamptz', default: null })
  createdAtImageMain: Date; //Date when first player initialized the pair

  // //---image 48x48 -----------
  // @Column({ type: 'character varying', default: null })
  // keySmallImageMain: string;
  // @Column({ type: 'int', default: null })
  // sizeSmallImageMain: number;
  // @Column({ type: 'character varying', default: null })
  // fieldIdSmallImageMain: string;
  // @Column({ type: 'timestamptz', default: null })
  // createdAtSmallImageMain: Date; //Date when first player initialized the pair

  //---image 1028x312 -----------
  @Column({ type: 'character varying', default: null })
  keyImageWallpaper: string;
  @Column({ type: 'int', default: null })
  sizeImageWallpaper: number;
  @Column({ type: 'character varying', default: null })
  fieldIdImageWallpaper: string;
  @Column({ type: 'timestamptz', default: null })
  createdAtImageWallpaper: Date; //Date when first player initialized the pair

  @OneToOne(() => Blog, (b) => b.image)
  blog: Blog;

  constructor(userId: string, blogId: string, blog?: Blog) {
    this.userId = userId;
    this.blogId = blogId;
    this.blog = blog;
  }

  static createImageBlog(userId: string, blogId: string, blog?: Blog) {
    return new ImageBlog(userId, blogId, blog);
  }

  async setImageMain(
    // smallImageMain: { key: string; fieldId: string },
    imageMain: { key: string; fieldId: string },
    photo: Buffer,
    // changedBuffer: Buffer,
  ): Promise<ImageBlog> {
    await this.checkingBufferImage156(photo);
    const metadataMainImage = await this.setMetadata(photo);
    // const metadataMainSmallImage = await this.setMetadata(changedBuffer);

    this.setValueImageMain(imageMain.key, imageMain.fieldId, metadataMainImage);

    // this.setValueSmallImageMain(smallImageMain.key, smallImageMain.fieldId, metadataMainSmallImage);
    return this;
  }

  async setImageWallpaper(urlImageWallpaper: { key: string; fieldId: string }, photo: Buffer): Promise<ImageBlog> {
    await this.checkingBufferImage1028(photo);
    const metadataWallpaperImage = await this.setMetadata(photo);
    this.setValueImageWallpaper(urlImageWallpaper.key, urlImageWallpaper.fieldId, metadataWallpaperImage);
    return this;
  }

  private async checkingBufferImage156(file: Buffer) {
    //default settings
    const contentTypes = ['png', 'jpg', 'jpeg'];
    const defaultSize = 100000; //Total size of image in bytes, for Stream and Buffer input only
    const defaultWidth = 156; //Number of pixels wide (EXIF orientation is not taken into consideration)
    const defaultHeight = 156; //Number of pixels high (EXIF orientation is not taken into consideration)
    //checking type
    const metadata: Metadata = await this.setMetadata(file);
    this.checkMetadata(contentTypes, defaultSize, defaultWidth, defaultHeight, metadata);
    return;
  }

  private async checkingBufferImage1028(file: Buffer) {
    //default settings
    const contentTypes = ['png', 'jpg', 'jpeg'];
    const defaultSize = 100000; //Total size of image in bytes, for Stream and Buffer input only
    const defaultWidth = 1028; //Number of pixels wide (EXIF orientation is not taken into consideration)
    const defaultHeight = 312; //Number of pixels high (EXIF orientation is not taken into consideration)
    //checking type
    const metadata: Metadata = await this.setMetadata(file);
    this.checkMetadata(contentTypes, defaultSize, defaultWidth, defaultHeight, metadata);
    return;
  }

  private checkMetadata(
    contentTypes: string[],
    defaultSize: number,
    defaultWidth: number,
    defaultHeight: number,
    metadata: sharp.Metadata,
  ) {
    const inputMimeType = metadata.format.split(' ');
    if (metadata.size > defaultSize || !contentTypes.includes(inputMimeType[0])) {
      throw new Error(`The file format is incorrect, please upload the correct file`);
    }
    // checking "width" and "height
    if (metadata.width !== defaultWidth && metadata.height !== defaultHeight) {
      throw new Error(`The file format is incorrect, please upload the correct file`);
    }
    return;
  }

  private async setMetadata(file: Buffer): Promise<Metadata> {
    return await sharp(file).metadata();
  }

  private setValueImageMain(key: string, fieldId: string, metadataMainImage: sharp.Metadata) {
    this.keyImageMain = key;
    this.fieldIdImageMain = fieldId;
    this.sizeMainImage = metadataMainImage.size;
    this.createdAtImageMain = new Date();
  }

  // private setValueSmallImageMain(key: string, fieldId: string, metadataMainImage: sharp.Metadata) {
  //   this.keySmallImageMain = key;
  //   this.fieldIdSmallImageMain = fieldId;
  //   this.sizeSmallImageMain = metadataMainImage.size;
  //   this.createdAtSmallImageMain = new Date();
  // }

  private setValueImageWallpaper(key: string, fieldId: string, metadataWallpaperImage: sharp.Metadata) {
    this.keyImageWallpaper = key;
    this.fieldIdImageWallpaper = fieldId;
    this.sizeImageWallpaper = metadataWallpaperImage.size;
    this.createdAtImageWallpaper = new Date();
  }
}
