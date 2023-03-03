import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadImageWallpaperCommand } from '../upload-image-wallpaper.command';
import { ForbiddenExceptionMY, NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../../blogs/infrastructure/blogs.repositories';
import { S3StorageAdapter } from '../../../domain/s3-storage-adapter.service';
import { BlogsQueryRepositories } from '../../../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { BlogImagesViewModel } from '../../../infrastructure/blog-images-view.dto';

@CommandHandler(UploadImageWallpaperCommand)
export class UploadImageWallpaperHandler implements ICommandHandler<UploadImageWallpaperCommand> {
  constructor(
    private readonly storageS3: S3StorageAdapter,
    private readonly blogsRepo: BlogsRepositories,
    private readonly blogsQueryRepo: BlogsQueryRepositories,
  ) {}

  async execute(command: UploadImageWallpaperCommand): Promise<BlogImagesViewModel> {
    const { userId, blogId, photo, mimetype } = command;
    const blog = await this.blogsRepo.findBlogWithRelations(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (!blog.checkOwner(userId)) throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    const key = `blogger/${userId}/wallpaper/${blogId}-1028x312.png`;
    //save on s3 storage
    const urlImageWallpaper = await this.storageS3.saveFile(userId, photo, key, mimetype);
    //creating instance main image
    await blog.setImageWallpaper(urlImageWallpaper, photo);
    //save
    const savedBlog = await this.blogsRepo.saveBlog(blog);
    //return for view
    return await this.blogsQueryRepo.getImageWallpaper(savedBlog.id);
  }
}
