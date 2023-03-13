import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUserIdBlogger } from '../../../main/decorators/current-user-id.param.decorator';
import { JwtAuthGuard } from '../../../main/guards/jwt-auth-bearer.guard';
import { AnswerDto } from './input-dtos/create-answer.dto';
import { QuizRepositories } from '../infrastructure/quiz-repositories';
import { ValidateUuidPipeFor404Error } from '../../../main/validators/id-validation-pipe';
import { QuizQueryRepositories } from '../infrastructure/query-repository/quiz-query-repositories';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../main/helpers/My-HttpExceptionFilter';
import {
  AnswerViewModel,
  GameViewModel,
} from '../infrastructure/query-repository/game-view.dto';
import { PaginationQuizDto } from './input-dtos/pagination-quiz.dto';
import { PaginationViewDto } from '../../../main/common/pagination-View.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResultDto } from '../../../main/common/api-error-result.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import { StatisticGameView } from '../infrastructure/query-repository/statistic-game-view.dto';
import { PaginationQuizTopDto } from './input-dtos/pagination-quiz-top.dto';
import { TopPlayerViewDto } from '../infrastructure/query-repository/top-player-view.dto';
import { ConnectionQuizCommand } from '../application/use-case/connection-quiz.handler';
import { AnswerQuizCommand } from '../application/use-case/answer-quiz.handler';

@ApiTags('PairQuizGame')
@Controller(`pair-game-quiz`)
export class QuizController {
  constructor(
    private commandBus: CommandBus,
    private readonly quizRepo: QuizRepositories,
    private readonly quizQueryRepo: QuizQueryRepositories,
  ) {}

  @ApiOperation({ summary: 'Get users top' })
  @ApiOkResponsePaginated(TopPlayerViewDto)
  @Get(`users/top`)
  async getTop(
    @Query() paginationInputModel: PaginationQuizTopDto,
  ): Promise<PaginationViewDto<TopPlayerViewDto>> {
    return this.quizQueryRepo.getTop(paginationInputModel);
  }

  @ApiOperation({ summary: 'Get current user statistic' })
  @ApiResponse({ status: 200, description: 'success', type: StatisticGameView })
  // @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(`users/my-statistic`)
  async myStatistic(@CurrentUserIdBlogger() userId: string): Promise<StatisticGameView> {
    return this.quizQueryRepo.getStatistic(userId);
  }

  @ApiOperation({ summary: 'Returns all my games (closed games and current)' })
  @ApiOkResponsePaginated(GameViewModel)
  @ApiResponse({ status: 200, description: 'success', type: GameViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(`pairs/my`)
  async myGames(
    @CurrentUserIdBlogger() userId: string,
    @Query() paginationInputModel: PaginationQuizDto,
  ): Promise<PaginationViewDto<GameViewModel>> {
    return this.quizQueryRepo.getGames(userId, paginationInputModel);
  }

  @ApiOperation({ summary: 'Returns current unfinished user game' })
  @ApiResponse({ status: 200, description: 'success', type: GameViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found active pair for current user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(`pairs/my-current`)
  async getCurrentGame(@CurrentUserIdBlogger() userId: string): Promise<GameViewModel> {
    const pendingGame = await this.quizRepo.findCurrentGame(userId);
    if (!pendingGame) throw new NotFoundExceptionMY('Not found game');
    return await this.quizQueryRepo.findCurrentGame(userId);
  }

  @ApiOperation({ summary: 'Returns game by id' })
  @ApiResponse({ status: 200, description: 'success', type: GameViewModel })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Current user is already participating in active pair',
  })
  @ApiResponse({ status: 404, description: 'Not found game' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(`/pairs/:id`)
  async getPairGame(
    @CurrentUserIdBlogger() userId: string,
    @Param(`id`, ValidateUuidPipeFor404Error) id: string,
  ): Promise<GameViewModel> {
    const activeGame = await this.quizRepo.findGame(id);
    if (!activeGame) throw new NotFoundExceptionMY('Not found active game');
    if (activeGame.isPlayerParticipate(userId))
      throw new ForbiddenExceptionMY('The player did not participate in the game');
    return this.quizQueryRepo.getGameById(userId, id);
  }

  @ApiOperation({
    summary:
      'Connect current user to existing random pending pair or create new pair which will be waiting second player',
  })
  @ApiResponse({ status: 200, description: 'success', type: GameViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Current user is already participating in active pair',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post(`pairs/connection`)
  async connectionQuiz(@CurrentUserIdBlogger() userId: string): Promise<GameViewModel> {
    return this.commandBus.execute(new ConnectionQuizCommand(userId));
  }

  @ApiOperation({ summary: 'Send answer for next not answered question in active pair' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Current user is already participating in active pair',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post(`pairs/my-current/answers`)
  async answer(
    @CurrentUserIdBlogger() userId: string,
    @Body() inputAnswerModel: AnswerDto,
  ): Promise<AnswerViewModel> {
    return this.commandBus.execute(new AnswerQuizCommand(userId, inputAnswerModel));
  }
}
