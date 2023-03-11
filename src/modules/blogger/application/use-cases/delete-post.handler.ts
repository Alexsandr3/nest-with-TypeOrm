import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../helpers/My-HttpExceptionFilter';
import { PostsRepositories } from '../../../posts/infrastructure/posts-repositories';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';

export class DeletePostCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly postId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postsRepo: PostsRepositories,
    private readonly blogsRepo: BlogsRepositories,
  ) {}

  async execute(command: DeletePostCommand): Promise<boolean> {
    const { postId, blogId, userId } = command;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (!blog.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    const result = await this.postsRepo.deletePost(postId, userId);
    if (!result) throw new NotFoundExceptionMY(`Not found for id: ${postId}`);
    return true;
  }
}
