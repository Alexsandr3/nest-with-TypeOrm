import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundExceptionMY } from '../../../../helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../infrastructure/blogs.repositories';
import { UsersRepositories } from '../../../sa-users/infrastructure/users-repositories';

export class UnsubscriptionToBlogCommand {
  constructor(public readonly blogId: string, public readonly userId: string) {}
}

@CommandHandler(UnsubscriptionToBlogCommand)
export class UnsubscriptionToBlogHandler implements ICommandHandler<UnsubscriptionToBlogCommand> {
  constructor(private readonly blogsRepo: BlogsRepositories, private readonly userRepo: UsersRepositories) {}

  async execute(command: UnsubscriptionToBlogCommand) {
    const { blogId, userId } = command;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    //unsubscribe from blog
    blog.unSubscribe();
    //find user and unsubscribe from blog
    const user = await this.userRepo.findUserById(userId);
    user.unSubscribe(blogId);
    //save changes
    await this.userRepo.saveUser(user);
    await this.blogsRepo.saveBlog(blog);
    return;
  }
}
