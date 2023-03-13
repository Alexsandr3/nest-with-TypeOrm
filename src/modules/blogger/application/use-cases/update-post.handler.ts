import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../main/helpers/My-HttpExceptionFilter';
import { PostsRepositories } from '../../../posts/infrastructure/posts-repositories';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';
import { CreatePostDto } from '../../../posts/api/input-Dtos/create-post.dto';

export class UpdatePostCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly postId: string,
    public readonly postInputModel: CreatePostDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly postsRepo: PostsRepositories,
    private readonly blogsRepo: BlogsRepositories,
  ) {}

  async execute(command: UpdatePostCommand): Promise<boolean> {
    const { postId, blogId, userId } = command;
    const { title, shortDescription, content } = command.postInputModel;
    //finding blog
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (!blog.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    //finding post
    const post = await this.postsRepo.getPost(postId, userId);
    if (!post) throw new NotFoundExceptionMY(`Not found post with id: ${postId}`);
    //update post
    post.updatePost(title, shortDescription, content, blogId);
    //save updated post
    await this.postsRepo.savePost(post);
    return true;
  }
}
