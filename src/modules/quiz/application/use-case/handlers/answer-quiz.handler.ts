import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepositories } from '../../../infrastructure/quiz-repositories';
import { ForbiddenExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { AnswerViewModel } from '../../../infrastructure/query-repository/game-view.dto';
import { AnswerQuizCommand } from '../answer-quiz.command';
// import { Cron, CronExpression } from '@nestjs/schedule';

@CommandHandler(AnswerQuizCommand)
export class AnswerQuizHandler implements ICommandHandler<AnswerQuizCommand> {
  constructor(private readonly quizRepo: QuizRepositories) {}

  async execute(command: AnswerQuizCommand): Promise<AnswerViewModel> {
    const { answer } = command.inputAnswerModel;
    const { userId } = command;
    try {
      const activeGame = await this.quizRepo.findActiveGameByUserId(userId);
      if (!activeGame)
        throw new ForbiddenExceptionMY(
          'Current user is already participating in active pair',
        );
      activeGame.startGame(userId, answer);
      await this.quizRepo.saveGame(activeGame);
      const result =
        activeGame.getIdFirstPlayer() === userId
          ? activeGame.getLastAnswerFirstPlayer()
          : activeGame.getLastAnswerSecondPlayer();
      return new AnswerViewModel(
        result.questionId,
        result.answerStatus,
        result.addedAt.toISOString(),
      );
    } catch (e) {
    } finally {
    }
  }

  //todo:
  // @Cron(CronExpression.EVERY_SECOND)
  private async forcedFinishGames() {
    try {
      const games = await this.quizRepo.forcedFinishGame(); //select for update
      if (!games) return;
      for (let i = 1; i <= games.length; i++) {
        games[i - 1].forcedFinishGame();
        await this.quizRepo.saveGame(games[i - 1]);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }
}
