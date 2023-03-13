import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { BaseTransaction } from '../../../../main/helpers/base-transaction';
import { AnswerViewModel } from '../../infrastructure/query-repository/game-view.dto';
import { ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { QuizRepositories } from '../../infrastructure/quiz-repositories';
import { AnswerQuizCommand } from './answer-quiz.handler';

@Injectable()
// @CommandHandler(AnswerQuizCommand)
export class AnswerTransaction
  extends BaseTransaction<AnswerQuizCommand, AnswerViewModel>
  implements ICommandHandler<AnswerQuizCommand>
{
  dataSource: DataSource;
  constructor(private readonly quizRepo: QuizRepositories, connection: DataSource) {
    super(connection);
    this.dataSource = connection;
  }
  async execute(command: AnswerQuizCommand): Promise<AnswerViewModel> {
    return await this.run(command);
  }
  // the important thing here is to use the manager that we've created in the base class
  protected async onExecute(
    data: AnswerQuizCommand,
    manager: EntityManager,
  ): Promise<AnswerViewModel> {
    const { answer } = data.inputAnswerModel;
    const { userId } = data;
    //start ----
    const activeGame = await this.quizRepo.findActiveGameByUserIdManager(userId, manager);
    if (!activeGame)
      throw new ForbiddenExceptionMY(
        'Current user is already participating in active pair',
      );
    activeGame.startGame(userId, answer);
    // console.log('--__________________________________-');
    await this.quizRepo.saveGame(activeGame, manager);
    const result =
      activeGame.getIdFirstPlayer() === userId
        ? activeGame.getLastAnswerFirstPlayer()
        : activeGame.getLastAnswerSecondPlayer();
    //finish ----
    return new AnswerViewModel(
      result.questionId,
      result.answerStatus,
      result.addedAt.toISOString(),
    );
  }
}
