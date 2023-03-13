import { UsersRepositories } from '../../infrastructure/users-repositories';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { PostsRepositories } from '../../../posts/infrastructure/posts-repositories';
import { UpdateBanInfoDto } from '../../api/input-Dto/update-ban-info.dto';

export class BanUserSaCommand {
  constructor(
    public readonly updateBanInfoModel: UpdateBanInfoDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(BanUserSaCommand)
export class BanUserSaHandler implements ICommandHandler<BanUserSaCommand> {
  constructor(
    private readonly usersRepo: UsersRepositories,
    private readonly postsRepo: PostsRepositories,
  ) {}

  async execute(command: BanUserSaCommand): Promise<boolean> {
    const { userId } = command;
    const { isBanned, banReason } = command.updateBanInfoModel;
    const user = await this.usersRepo.findUserByIdWithMapped(userId);
    //userForBan.update()
    //repo.saveBanned(userForBan)
    if (!user) throw new NotFoundExceptionMY(`Not found `);
    isBanned ? user.banUser(banReason) : user.unblockUser();
    // user.checkStatusBan() ? user.banUser(banReason) : user.unblockUser();
    await this.usersRepo.saveUser(user);
    //update status ban -  Posts, LikesPost, Comment, LikesComment for User
    const res = await this.postsRepo.updateStatusBanContentsUser(userId, isBanned);
    if (!res) throw new Error(`Not saved`);
    return true;
  }
}
