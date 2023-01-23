import { NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteQuestionCommand } from '../delete-question-command';
import { QuestionRepository } from '../../../infrastructure/question.reposit';

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler
  implements ICommandHandler<DeleteQuestionCommand>
{
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
