import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';
import { UsersRepositories } from '../../../sa-users/infrastructure/users-repositories';
import { UnauthorizedExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { Blog } from '../../../../entities/blog.entity';
import { CreateBlogDto } from '../../api/input-dtos/create-blog.dto';

export class CreateBlogCommand {
  constructor(
    public readonly userId: string,
    public readonly blogInputModel: CreateBlogDto,
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepositories,
    private readonly usersRepo: UsersRepositories,
  ) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const { name, description, websiteUrl } = command.blogInputModel;
    const { userId } = command;
    //finding the user for check
    const user = await this.usersRepo.findUserByIdWithMapped(userId);
    if (user.id !== userId)
      throw new UnauthorizedExceptionMY(`user with id: ${userId} Unauthorized`);
    //preparation Blog for save in DB
    const newBlog = Blog.createBlog(userId, name, description, websiteUrl, user);
    //save created instance
    const createdBlog = await this.blogsRepo.saveBlog(newBlog);
    if (!createdBlog) throw new Error(`Not created`);
    return createdBlog.id;
  }
}
