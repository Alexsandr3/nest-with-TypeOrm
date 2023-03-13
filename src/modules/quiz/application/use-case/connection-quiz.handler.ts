import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../sa-users/infrastructure/users-repositories';
import { QuizRepositories } from '../../infrastructure/quiz-repositories';
import { Player } from '../../../../entities/player.entity';
import { Game } from '../../../../entities/game.entity';
import { ForbiddenExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { GameViewModel } from '../../infrastructure/query-repository/game-view.dto';
import { QuizQueryRepositories } from '../../infrastructure/query-repository/quiz-query-repositories';

export class ConnectionQuizCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(ConnectionQuizCommand)
export class ConnectionQuizHandler implements ICommandHandler<ConnectionQuizCommand> {
  constructor(
    private readonly quizRepo: QuizRepositories,
    private readonly usersRepo: UsersRepositories,
    private readonly quizQueryRepo: QuizQueryRepositories,
  ) {}

  async execute(command: ConnectionQuizCommand): Promise<GameViewModel> {
    const { userId } = command;
    const user = await this.usersRepo.findUserByIdWithMapped(userId);
    //search for questions
    const questions = await this.quizRepo.findQuestions();
    //find an active game
    const activeGame = await this.quizRepo.findActiveAndPendingGameByUserId(userId);
    if (activeGame) {
      throw new ForbiddenExceptionMY(
        'Current user is already participating in active pair',
      );
    }
    //find a waiting game
    const pendingGame = await this.quizRepo.findPendingGame();
    if (pendingGame) {
      //creating instance player
      const player = Player.createPlayer(user.getLogin(), userId, pendingGame.id);
      const savedPlayer = await this.quizRepo.savePlayer(player);
      //adding a second player to the game
      pendingGame.addSecondPlayer(savedPlayer, userId);
      await this.quizRepo.saveGame(pendingGame);
      //the game for viewing
      return this.quizQueryRepo.mappedSecondPlayerForView(pendingGame.id);
    }
    //creating instance game
    const game = Game.createGame(questions, userId); //questions
    const savedGame = await this.quizRepo.saveGame(game);
    //creating instance player
    const player = Player.createPlayer(user.getLogin(), userId, savedGame.id);
    const savedPlayer = await this.quizRepo.savePlayer(player);
    //adding the first player to the game
    savedGame.addFirstPlayer(savedPlayer);
    await this.quizRepo.saveGame(savedGame);
    //the game for viewing
    return this.quizQueryRepo.mappedFirstPlayerForView(savedGame.id);
  }
}
