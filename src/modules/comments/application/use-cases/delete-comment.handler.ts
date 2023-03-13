import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepositories } from '../../infrastructure/comments.repositories';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../main/helpers/My-HttpExceptionFilter';

export class DeleteCommentCommand {
  constructor(public readonly id: string, public readonly userId: string) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(private readonly commentsRepo: CommentsRepositories) {}

  async execute(command: DeleteCommentCommand): Promise<boolean> {
    const { id } = command;
    const { userId } = command;
    //finding comment by id from uri params
    const comment = await this.commentsRepo.findCommentsById(id);
    if (!comment) throw new NotFoundExceptionMY(`Not found content`);
    //checking comment
    if (!comment.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the comment`);
    //delete a comment from DB
    const result = await this.commentsRepo.deleteCommentsById(id);
    if (!result) throw new Error(`not today`);
    return true;
  }
}
