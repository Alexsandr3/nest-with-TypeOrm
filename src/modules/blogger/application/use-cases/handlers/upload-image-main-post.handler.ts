import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenExceptionMY, NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../../blogs/infrastructure/blogs.repositories';
import { reSizeImage } from '../../../../../helpers/re-size.image';
import { S3StorageAdapter } from '../../../domain/s3-storage-adapter.service';
import { BlogsQueryRepositories } from '../../../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { UploadImageMainPostCommand } from '../upload-image-main-post.command';
import { PostsRepositories } from '../../../../posts/infrastructure/posts-repositories';
import { PostsQueryRepositories } from '../../../../posts/infrastructure/query-repositories/posts-query.reposit';
import { PostImagesViewModel } from '../../../infrastructure/post-images-view.dto';

@CommandHandler(UploadImageMainPostCommand)
export class UploadImageMainPostHandler implements ICommandHandler<UploadImageMainPostCommand> {
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
    if (!blog.checkOwner(userId)) throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    //finding post
    const post = await this.postsRepo.getPostWithRelations(postId, userId);
    if (!post) throw new NotFoundExceptionMY(`Not found post with id: ${postId}`);
    const key = `blogger/${userId}/blog/${blogId}/post/${postId}_main_940x432.png`;
    const keyMiddle = `blogger/${userId}/blog/${blogId}/post/${postId}_main_300x180.png`;
    const keySmall = `blogger/${userId}/blog/${blogId}/post/${postId}_main_149x96.png`;
    //changing size
    const middlePhoto = await reSizeImage(photo, 300, 180);
    const smallPhoto = await reSizeImage(photo, 149, 96);
    //save on s3 storage
    const [urlImageMain, urlMiddleImageMain, urlSmallImageMain] = await Promise.all([
      this.storageS3.saveFile(userId, photo, key, mimetype),
      this.storageS3.saveFile(userId, middlePhoto, keyMiddle, mimetype),
      this.storageS3.saveFile(userId, smallPhoto, keySmall, mimetype),
    ]);
    //creating instance main image
    await post.setImageMain(urlImageMain, urlMiddleImageMain, urlSmallImageMain, photo, middlePhoto, smallPhoto);
    //save
    const savedPost = await this.postsRepo.savePost(post);
    //return for view
    return await this.postsQueryRepo.getImageMain(savedPost.id);
  }
}
