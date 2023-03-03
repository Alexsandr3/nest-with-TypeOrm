export class UploadImageMainPostCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly postId: string,
    public readonly mimetype: string,
    public readonly photo: Buffer,
  ) {}
}
