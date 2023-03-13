import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';
import { NotFoundExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';

export class BindBlogCommand {
  constructor(public readonly blogId: string, public readonly userId: string) {}
}

@CommandHandler(BindBlogCommand)
export class BindBlogHandler implements ICommandHandler<BindBlogCommand> {
  constructor(private readonly blogsRepo: BlogsRepositories) {}

  async execute(command: BindBlogCommand): Promise<boolean> {
    const { userId, blogId } = command;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`not found blog with id: ${blogId}`);
    blog.updateOwner(userId);
    await this.blogsRepo.saveBlog(blog);
    return true;
  }
}
