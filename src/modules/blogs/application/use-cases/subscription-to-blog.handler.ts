import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../infrastructure/blogs.repositories';
import { UsersRepositories } from '../../../sa-users/infrastructure/users-repositories';

export class SubscriptionToBlogCommand {
  constructor(public readonly blogId: string, public readonly userId: string) {}
}

@CommandHandler(SubscriptionToBlogCommand)
export class SubscriptionToBlogHandler
  implements ICommandHandler<SubscriptionToBlogCommand>
{
  constructor(
    private readonly blogsRepo: BlogsRepositories,
    private readonly userRepo: UsersRepositories,
  ) {}

  async execute(command: SubscriptionToBlogCommand) {
    const { blogId, userId } = command;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    //add subscription to blog
    blog.addSubscription();
    await this.blogsRepo.saveBlog(blog);
    //find user and add subscription
    const user = await this.userRepo.findUserById(userId);
    user.setSubscription(blogId, userId, user);
    await this.userRepo.saveUser(user);
    return;
  }
}
