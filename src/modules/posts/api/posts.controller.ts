import { Body, Controller, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PostsQueryRepositories } from '../infrastructure/query-repositories/posts-query.reposit';
import { ValidateUuidPipe } from '../../../main/validators/id-validation-pipe';
import { JwtAuthGuard } from '../../../main/guards/jwt-auth-bearer.guard';
import { UpdateLikeStatusDto } from './input-Dtos/update-Like-Status.dto';
import { CurrentUserId } from '../../../main/decorators/current-user-id.param.decorator';
import { CreateCommentDto } from './input-Dtos/create-comment.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentViewModel } from '../../comments/infrastructure/query-repository/comment-view.dto';
import { ApiErrorResultDto } from '../../../main/common/api-error-result.dto';
import { UpdateLikeStatusCommand } from '../application/use-cases/update-like-status-post.handler';
import { CreateCommentCommand } from '../application/use-cases/create-comment.handler';

@ApiTags('Posts')
@SkipThrottle()
@Controller(`posts`)
export class PostsController {
  constructor(
    private readonly postsQueryRepo: PostsQueryRepositories,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: 'Make like/unlike/dislike/undislike operation' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(`:postId/like-status`)
  async updateLikeStatus(
    @CurrentUserId() userId: string,
    @Param(`postId`, ValidateUuidPipe) id: string,
    @Body() updateLikeStatusInputModel: UpdateLikeStatusDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new UpdateLikeStatusCommand(id, updateLikeStatusInputModel, userId),
    );
  }

  @ApiOperation({ summary: 'Create new comment' })
  @ApiResponse({ status: 201, description: 'success', type: CommentViewModel })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found post' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(`:postId/comments`)
  async createComment(
    @CurrentUserId() userId: string,
    @Param(`postId`, ValidateUuidPipe) id: string,
    @Body() inputCommentModel: CreateCommentDto,
  ): Promise<CommentViewModel> {
    return await this.commandBus.execute(
      new CreateCommentCommand(id, inputCommentModel, userId),
    );
  }
}
