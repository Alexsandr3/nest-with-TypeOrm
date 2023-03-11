import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../helpers/My-HttpExceptionFilter';
import { UpdateBlogDto } from '../../api/input-dtos/update-blog.dto';

export class UpdateBlogCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly blogInputModel: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepo: BlogsRepositories) {}

  async execute(command: UpdateBlogCommand): Promise<boolean> {
    const { blogInputModel, blogId, userId } = command;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (blog.checkOwner(userId)) {
      blog.updateBlog(blogInputModel);
      const result = await this.blogsRepo.saveBlog(blog);
      if (!result) throw new Error(`Not saved blog for id: ${blogId}`);
      return true;
    }
    throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
  }
}
