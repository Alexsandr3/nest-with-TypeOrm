export class UploadImageWallpaperCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly mimetype: string,
    public readonly photo: Buffer,
  ) {}
}
