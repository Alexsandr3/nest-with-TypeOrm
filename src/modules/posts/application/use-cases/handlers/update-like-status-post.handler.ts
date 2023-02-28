import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { PostsRepositories } from '../../../infrastructure/posts-repositories';
import { UpdateLikeStatusCommand } from '../update-like-status.command';
import { UsersRepositories } from '../../../../sa-users/infrastructure/users-repositories';
import { LikePost } from '../../../../../entities/like-post.entity';

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusPostHandler implements ICommandHandler<UpdateLikeStatusCommand> {
  constructor(private readonly postsRepo: PostsRepositories, private readonly usersRepo: UsersRepositories) {}

  async execute(command: UpdateLikeStatusCommand): Promise<boolean> {
    const { id, userId } = command;
    const { likeStatus } = command.updateLikeStatusInputModel;
    //finding post by id from uri params
    const post = await this.postsRepo.findPost(id);
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    //finding user by userId for update like status
    const user = await this.usersRepo.findUserByIdWithMapped(userId);
    //finding likePost for update like status
    const foundLikePost = await this.postsRepo.findLikePost(id, userId);
    if (!foundLikePost) {
      const newLikePost = LikePost.createLikePost(userId, id, post, user);
      //save
      newLikePost.updateLikePost(likeStatus);
      await this.postsRepo.saveLikePost(newLikePost);
      return true;
    }

    //update likeStatus
    foundLikePost.updateLikePost(likeStatus);
    await this.postsRepo.saveLikePost(foundLikePost);
    return true;
  }
}
