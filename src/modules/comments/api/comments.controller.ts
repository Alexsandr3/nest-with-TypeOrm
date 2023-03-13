import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepositories } from '../infrastructure/query-repository/comments-query.repositories';
import { ValidateUuidPipe } from '../../../main/validators/id-validation-pipe';
import { UpdateLikeStatusDto } from '../../posts/api/input-Dtos/update-Like-Status.dto';
import { CommentsService } from '../domain/comments.service';
import { CurrentUserId } from '../../../main/decorators/current-user-id.param.decorator';
import { UpdateCommentDto } from './input-Dtos/update-comment.dto';
import { JwtAuthGuard } from '../../../main/guards/jwt-auth-bearer.guard';
import { JwtForGetGuard } from '../../../main/guards/jwt-auth-bearer-for-get.guard';
import { CommandBus } from '@nestjs/cqrs';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResultDto } from '../../../main/common/api-error-result.dto';
import { CommentViewModel } from '../infrastructure/query-repository/comment-view.dto';
import { UpdateLikeStatusCommentCommand } from '../application/use-cases/update-like-status-comment.handler';
import { DeleteCommentCommand } from '../application/use-cases/delete-comment.handler';
import { UpdateCommentCommand } from '../application/use-cases/update-comment.handler';

@ApiTags('Comments')
@SkipThrottle()
@Controller(`comments`)
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private commandBus: CommandBus,
    private readonly commentsQueryRepo: CommentsQueryRepositories,
  ) {}

  @ApiOperation({ summary: 'Make like/unlike/dislike/undislike operation' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found comment' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(`/:id/like-status`)
  async updateLikeStatus(
    @CurrentUserId() userId: string,
    @Param(`id`, ValidateUuidPipe) id: string,
    @Body() updateLikeStatusInputModel: UpdateLikeStatusDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new UpdateLikeStatusCommentCommand(id, updateLikeStatusInputModel, userId),
    );
  }

  @ApiOperation({ summary: 'Update existing comment by id with InputModel' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the comment' })
  @ApiResponse({ status: 404, description: 'Not found comment' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(`/:id`)
  async updateCommentsById(
    @CurrentUserId() userId: string,
    @Param(`id`, ValidateUuidPipe) id: string,
    @Body() updateCommentInputModel: UpdateCommentDto,
  ): Promise<boolean> {
    await this.commandBus.execute(
      new UpdateCommentCommand(id, updateCommentInputModel, userId),
    );
    return true;
  }

  @ApiOperation({ summary: 'Delete comment specified by id' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the comment' })
  @ApiResponse({ status: 404, description: 'Not found comment' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(`/:id`)
  async deleteCommentById(
    @CurrentUserId() userId: string,
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteCommentCommand(id, userId));
    return true;
  }

  @ApiOperation({ summary: 'Return comment by id' })
  @ApiResponse({ status: 200, description: 'success', type: CommentViewModel })
  @ApiResponse({ status: 404, description: 'Not found comment' })
  @UseGuards(JwtForGetGuard)
  @Get(`/:id`)
  async findOne(
    @CurrentUserId() userId: string,
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<CommentViewModel> {
    return this.commentsQueryRepo.getComment(id, userId);
  }
}
