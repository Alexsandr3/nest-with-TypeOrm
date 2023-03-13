import { NotFoundExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../infrastructure/question.reposit';

export class DeleteQuestionCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler implements ICommandHandler<DeleteQuestionCommand> {
  constructor(private readonly questionRepo: QuestionRepository) {}

  async execute(command: DeleteQuestionCommand): Promise<boolean> {
    const id = command.id;
    const question = await this.questionRepo.findQuestionByIdWithMapped(id);
    if (!question) {
      throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    }
    await this.questionRepo.deleteQuestion(id);
    return true;
  }
}
