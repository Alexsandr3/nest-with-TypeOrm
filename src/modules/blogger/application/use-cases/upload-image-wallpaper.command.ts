export class UploadImageWallpaperCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly originalname: string,
    public readonly photo: Buffer,
  ) {}
}
