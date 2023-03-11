import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../helpers/My-HttpExceptionFilter';

export class DeleteBlogCommand {
  constructor(public readonly blogId: string, public readonly userId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepo: BlogsRepositories) {}

  async execute(command: DeleteBlogCommand): Promise<boolean> {
    const { blogId, userId } = command;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (blog.checkOwner(userId)) {
      const result = await this.blogsRepo.deleteBlog(blogId, userId);
      if (!result) throw new NotFoundExceptionMY(`Not found for id: ${blogId}`);
      return true;
    }
    throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
  }
}
