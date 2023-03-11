import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';
import { S3StorageAdapter } from '../../domain/s3-storage-adapter.service';
import { BlogsQueryRepositories } from '../../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { BlogImagesViewModel } from '../../infrastructure/blog-images-view.dto';

export class UploadImageMainCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly mimetype: string,
    public readonly photo: Buffer,
  ) {}
}

@CommandHandler(UploadImageMainCommand)
export class UploadImageMainHandler implements ICommandHandler<UploadImageMainCommand> {
  constructor(
    private readonly storageS3: S3StorageAdapter,
    private readonly blogsRepo: BlogsRepositories,
    private readonly blogsQueryRepo: BlogsQueryRepositories,
  ) {}

  async execute(command: UploadImageMainCommand): Promise<BlogImagesViewModel> {
    const { userId, blogId, photo, mimetype } = command;
    const blog = await this.blogsRepo.findBlogWithRelations(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (!blog.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    const keyImage = `blogger/${userId}/blog/${blogId}_main_156x156.png`;
    //save on s3 storage
    if (blog.image) {
      await this.storageS3.deleteFile(keyImage);
    }
    const [urlSmallImageMain] = await Promise.all([
      this.storageS3.saveFile(userId, photo, keyImage, mimetype),
    ]);
    //creating instance main image
    await blog.setImageMain(urlSmallImageMain, photo);
    //save
    const savedBlog = await this.blogsRepo.saveBlog(blog);
    //return for view
    return await this.blogsQueryRepo.getImageMain(savedBlog.id);
  }
}
