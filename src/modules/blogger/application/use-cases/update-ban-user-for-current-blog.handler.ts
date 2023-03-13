import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../main/helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../blogs/infrastructure/blogs.repositories';
import { UsersRepositories } from '../../../sa-users/infrastructure/users-repositories';
import { BannedBlogUser } from '../../../../entities/banned-blog-user.entity';
import { UpdateBanInfoForUserDto } from '../../api/input-dtos/update-ban-info-for-user.dto';

export class UpdateBanUserForCurrentBlogCommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly banUserForCurrentBlogInputModel: UpdateBanInfoForUserDto,
  ) {}
}

@CommandHandler(UpdateBanUserForCurrentBlogCommand)
export class UpdateBanUserForCurrentBlogHandler
  implements ICommandHandler<UpdateBanUserForCurrentBlogCommand>
{
  constructor(
    private readonly usersRepo: UsersRepositories,
    private readonly blogsRepo: BlogsRepositories,
  ) {}

  async execute(command: UpdateBanUserForCurrentBlogCommand): Promise<boolean> {
    const { id, userId } = command;
    const { isBanned, banReason, blogId } = command.banUserForCurrentBlogInputModel;
    const user = await this.usersRepo.findUserByIdWithMapped(id);
    if (!user) throw new NotFoundExceptionMY(`Not found user with id: ${id}`);
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${id}`);
    if (!blog.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    const foundBanStatus = await this.blogsRepo.findStatusBanBy(id, blogId);
    if (!foundBanStatus) {
      const newBanStatus = BannedBlogUser.createBan(
        blogId,
        userId, //Who banned user!
        user.id, //User for ban
        user.getLogin(),
        user.getEmail(),
        blog,
      );
      const savedBanStatus = await this.blogsRepo.saveBanStatus(newBanStatus);
      if (isBanned === false) {
        savedBanStatus.unlockBanStatus();
        await this.blogsRepo.saveBanStatus(savedBanStatus);
      } else {
        savedBanStatus.banBanStatus(banReason);
        await this.blogsRepo.saveBanStatus(savedBanStatus);
      }
      return true;
    }
    isBanned ? foundBanStatus.banBanStatus(banReason) : foundBanStatus.unlockBanStatus();
    await this.blogsRepo.saveBanStatus(foundBanStatus);
    // if (isBanned === false) {
    //   foundBanStatus.unlockBanStatus();
    //   await this.blogsRepo.saveBanStatus(foundBanStatus);
    // } else {
    //   foundBanStatus.banBanStatus(banReason);
    //   await this.blogsRepo.saveBanStatus(foundBanStatus);
    // }
    return true;
  }
}
