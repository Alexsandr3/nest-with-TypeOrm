import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatusesType } from '../../../entities/game.entity';
import { Player } from '../../../entities/player.entity';
import { Question } from '../../../entities/question.entity';
import { Answer, AnswerStatusesType } from '../../../entities/answer.entity';

export class QuizRepositories {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async saveGame(createdGame: Game): Promise<Game> {
    return this.gameRepo.save(createdGame);
  }

  async savePlayer(createdPlayer: Player): Promise<Player> {
    return this.playerRepo.save(createdPlayer);
  }

  async saveAnswer(createdAnswer: Answer): Promise<Answer> {
    return this.answerRepo.save(createdAnswer);
  }

  //get
  async findCurrentGame(userId: string): Promise<Game> {
    return await this.gameRepo.findOne({
      select: ['id', 'status'],
      where: [
        {
          status: GameStatusesType.Active,
          firstPlayerId: userId,
        },
        {
          status: GameStatusesType.Active,
          secondPlayerId: userId,
        },
        {
          status: GameStatusesType.PendingSecondPlayer,
          firstPlayerId: userId,
        },
      ],
    });
    // .catch((e) => {
    //   return null;
    // });
    // console.log(games);
    // if (games.length === 0) return null;
    // return true;
  }

  async findAnyGameById(gameId: string): Promise<boolean> {
    const game = await this.gameRepo.findOne({
      select: ['id'],
      where: { id: gameId },
    });
    if (!game) return null;
    return true;
  }

  async getGamePlayer(id: string, userId: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: ['id', 'questions'],
      where: [
        { id: id, firstPlayerId: userId },
        { id: id, secondPlayerId: userId },
      ],
    });
    if (!game) return null;
    return game;
  }

  //connection
  async findPendingGame(): Promise<Game> {
    const game = await this.gameRepo.findOne({
      where: { status: GameStatusesType.PendingSecondPlayer },
    });
    if (!game) return null;
    return game;
  }

  async findActiveAndPendingGameByUserId(userId: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: [
        { status: GameStatusesType.Active, firstPlayerId: userId },
        { status: GameStatusesType.PendingSecondPlayer, firstPlayerId: userId },
        { status: GameStatusesType.Active, secondPlayerId: userId },
      ],
    });
    if (!game) return null;
    return game;
  }

  async findQuestions(): Promise<Question[]> {
    return this.questionRepo.find({
      select: ['id', 'body'],
      where: { published: true },
      // order: { createdAt: 'ASC' },
      take: 5,
    });
    // .createQueryBuilder('q')
    // .select(['q.id, q.body'])
    // .orderBy('RANDOM()')
    // .take(5)
    // .getMany();
  }

  //answer
  async findActiveGameByUserId(userId: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: [
        { status: GameStatusesType.Active, firstPlayerId: userId },
        { status: GameStatusesType.Active, secondPlayerId: userId },
      ],
    });
    if (!game) return null;
    return game;
  }

  async findPlayer(userId: string, gameId: string): Promise<Player> {
    return this.playerRepo.findOne({
      relations: { answers: true },
      where: { id: userId, gameId: gameId },
    });
  }

  async fastestFirstSuccessAnswer(userId: string, gameId: string): Promise<Answer[]> {
    return this.answerRepo.find({
      select: ['addedAt'],
      where: { playerId: userId, gameId: gameId, answerStatus: AnswerStatusesType.Correct },
      order: { addedAt: 'ASC' },
      take: 1,
    });
  }
}