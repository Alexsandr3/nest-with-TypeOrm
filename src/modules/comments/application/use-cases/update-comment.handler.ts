import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepositories } from '../../infrastructure/comments.repositories';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../main/helpers/My-HttpExceptionFilter';
import { UpdateCommentDto } from '../../api/input-Dtos/update-comment.dto';

export class UpdateCommentCommand {
  constructor(
    public readonly id: string,
    public readonly updateCommentInputModel: UpdateCommentDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler implements ICommandHandler<UpdateCommentCommand> {
  constructor(private readonly commentsRepo: CommentsRepositories) {}

  async execute(command: UpdateCommentCommand) {
    const { id, userId } = command;
    const { content } = command.updateCommentInputModel;
    //finding comment by id from uri params
    const comment = await this.commentsRepo.findCommentsById(id);
    if (!comment) throw new NotFoundExceptionMY(`Not found content`);
    //checking comment
    if (!comment.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the comment`);
    //updating a comment
    comment.updateComment(content);
    //save updated comment
    await this.commentsRepo.saveComment(comment);
    return true;
  }
}
