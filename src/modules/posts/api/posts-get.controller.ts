import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PostsQueryRepositories } from '../infrastructure/query-repositories/posts-query.reposit';
import { PaginationViewDto } from '../../../main/common/pagination-View.dto';
import { PostViewModel } from '../infrastructure/query-repositories/post-view.dto';
import { ValidateUuidPipe } from '../../../main/validators/id-validation-pipe';
import { CurrentUserId } from '../../../main/decorators/current-user-id.param.decorator';
import { JwtForGetGuard } from '../../../main/guards/jwt-auth-bearer-for-get.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentViewModel } from '../../comments/infrastructure/query-repository/comment-view.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import { PaginationPostDto } from './input-Dtos/pagination-post.dto';
import { PaginationCommentDto } from '../../blogger/api/input-dtos/pagination-comment.dto';

@ApiTags('Posts')
@SkipThrottle()
@Controller(`posts`)
export class PostsGetController {
  constructor(private readonly postsQueryRepo: PostsQueryRepositories) {}

  @ApiOperation({ summary: 'Returns all comments for specified post with pagination' })
  @ApiOkResponsePaginated(CommentViewModel)
  @ApiResponse({ status: 200, description: 'success', type: CommentViewModel })
  @ApiResponse({ status: 404, description: 'Not found post' })
  @UseGuards(JwtForGetGuard)
  @Get(`:postId/comments`)
  async findComments(
    @CurrentUserId() userId: string,
    @Param(`postId`, ValidateUuidPipe) id: string,
    @Query() paginationInputModel: PaginationCommentDto,
  ): Promise<PaginationViewDto<CommentViewModel>> {
    return await this.postsQueryRepo.findCommentsByIdPost(
      id,
      paginationInputModel,
      userId,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns all posts with pagination' })
  @ApiOkResponsePaginated(PostViewModel)
  @ApiResponse({ status: 200, description: 'success', type: PostViewModel })
  @UseGuards(JwtForGetGuard)
  @Get()
  async findAll(
    @CurrentUserId() userId: string,
    @Query() pagination: PaginationPostDto,
  ): Promise<PaginationViewDto<PostViewModel>> {
    return await this.postsQueryRepo.findPosts(pagination, userId);
  }

  @ApiOperation({ summary: 'Return post by id' })
  @ApiResponse({ status: 200, description: 'success', type: PostViewModel })
  @UseGuards(JwtForGetGuard)
  @Get(`:id`)
  async findOne(
    @CurrentUserId() userId: string,
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<PostViewModel> {
    return await this.postsQueryRepo.findPost(id, userId);
  }
}
