import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Question } from '../../../../entities/question.entity';
import { QuestionRepository } from '../../infrastructure/question.reposit';
import { QuestionQueryRepository } from '../../infrastructure/query-reposirory/question-query.reposit';
import { QuestionForSaViewModel } from '../../infrastructure/query-reposirory/question-for-sa-view.dto';
import { CreateQuestionDto } from '../../api/input-dtos/create-Question.dto';

export class CreateQuestionCommand {
  constructor(public readonly questionInputModel: CreateQuestionDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler implements ICommandHandler<CreateQuestionCommand> {
  constructor(
    private readonly questionRepo: QuestionRepository,
    private readonly questionQueryRepo: QuestionQueryRepository,
  ) {}

  async execute(command: CreateQuestionCommand): Promise<QuestionForSaViewModel> {
    const { body, correctAnswers } = command.questionInputModel;
    //create instance
    const question = Question.createQuestion(body, correctAnswers);
    //save
    const questionId = await this.questionRepo.saveQuestion(question);
    return await this.questionQueryRepo.findQuestion(questionId);
  }
}
