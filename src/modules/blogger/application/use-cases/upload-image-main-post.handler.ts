import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../main/helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';
import { reSizeImage } from '../../../../main/helpers/re-size.image';
import { S3StorageAdapter } from '../../domain/s3-storage-adapter.service';
import { BlogsQueryRepositories } from '../../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { PostsRepositories } from '../../../posts/infrastructure/posts-repositories';
import { PostsQueryRepositories } from '../../../posts/infrastructure/query-repositories/posts-query.reposit';
import { PostImagesViewModel } from '../../infrastructure/post-images-view.dto';

export class UploadImageMainPostCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly postId: string,
    public readonly mimetype: string,
    public readonly photo: Buffer,
  ) {}
}

@CommandHandler(UploadImageMainPostCommand)
export class UploadImageMainPostHandler
  implements ICommandHandler<UploadImageMainPostCommand>
{
  constructor(
    private readonly storageS3: S3StorageAdapter,
    private readonly blogsRepo: BlogsRepositories,
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly postsRepo: PostsRepositories,
    private readonly postsQueryRepo: PostsQueryRepositories,
  ) {}

  async execute(command: UploadImageMainPostCommand): Promise<PostImagesViewModel> {
    const { userId, blogId, postId, photo, mimetype } = command;
    //finding blog
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (!blog.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    //finding post
    const post = await this.postsRepo.getPostWithRelations(postId, userId);
    if (!post) throw new NotFoundExceptionMY(`Not found post with id: ${postId}`);
    const key = `blogger/${userId}/blog/${blogId}/post/${postId}_main_940x432.png`;
    const keyMiddle = `blogger/${userId}/blog/${blogId}/post/${postId}_main_300x180.png`;
    const keySmall = `blogger/${userId}/blog/${blogId}/post/${postId}_main_149x96.png`;
    //changing size image
    const middlePhoto = await reSizeImage(photo, 300, 180);
    const smallPhoto = await reSizeImage(photo, 149, 96);
    //delete old images
    const keys = [key, keyMiddle, keySmall];
    if (post.image) {
      for (const keyImage of keys) {
        await this.storageS3.deleteFile(keyImage);
      }
    }
    //save on s3 storage
    const [urlImageMain, urlMiddleImageMain, urlSmallImageMain] = await Promise.all([
      this.storageS3.saveFile(userId, photo, key, mimetype),
      this.storageS3.saveFile(userId, middlePhoto, keyMiddle, mimetype),
      this.storageS3.saveFile(userId, smallPhoto, keySmall, mimetype),
    ]);
    //creating instance main image
    await post.setImageMain(
      urlImageMain,
      urlMiddleImageMain,
      urlSmallImageMain,
      photo,
      middlePhoto,
      smallPhoto,
    );
    //save
    const savedPost = await this.postsRepo.savePost(post);
    //return for view
    return await this.postsQueryRepo.getImageMain(savedPost.id);
  }
}
