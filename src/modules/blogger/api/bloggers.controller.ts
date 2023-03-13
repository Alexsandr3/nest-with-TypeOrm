import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '../../posts/api/input-Dtos/create-post.dto';
import { ValidateUuidPipe } from '../../../main/validators/id-validation-pipe';
import { PostViewModel } from '../../posts/infrastructure/query-repositories/post-view.dto';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepositories } from '../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { JwtAuthGuard } from '../../../main/guards/jwt-auth-bearer.guard';
import { PaginationBlogDto } from './input-dtos/pagination-blog.dto';
import { PaginationViewDto } from '../../../main/common/pagination-View.dto';
import { CurrentUserIdBlogger } from '../../../main/decorators/current-user-id.param.decorator';
import { CreateBlogDto } from './input-dtos/create-blog.dto';
import { UpdateBlogDto } from './input-dtos/update-blog.dto';
import { UpdateBanInfoForUserDto } from './input-dtos/update-ban-info-for-user.dto';
import { PostsQueryRepositories } from '../../posts/infrastructure/query-repositories/posts-query.reposit';
import { ForbiddenExceptionMY } from '../../../main/helpers/My-HttpExceptionFilter';
import { SkipThrottle } from '@nestjs/throttler';
import { PaginationBannedUsersDto } from './input-dtos/pagination-banned-users.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResultDto } from '../../../main/common/api-error-result.dto';
import { BlogViewModel } from '../../blogs/infrastructure/query-repository/blog-view.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import { BloggerCommentsViewModel } from '../../comments/infrastructure/query-repository/comments-view.dto';
import { UsersForBanBlogView } from '../../sa-users/infrastructure/query-reposirory/user-ban-for-blog-view.dto';
import { BloggerViewModel } from '../../blogs/infrastructure/query-repository/blogger-view.dto';
import { PaginationCommentDto } from './input-dtos/pagination-comment.dto';
import { UpdateBlogCommand } from '../application/use-cases/update-blog.handler';
import { DeleteBlogCommand } from '../application/use-cases/delete-blog.handler';
import { CreateBlogCommand } from '../application/use-cases/create-blog.handler';
import { CreatePostCommand } from '../application/use-cases/create-post.handler';
import { UpdatePostCommand } from '../application/use-cases/update-post.handler';
import { DeletePostCommand } from '../application/use-cases/delete-post.handler';
import { UpdateBanUserForCurrentBlogCommand } from '../application/use-cases/update-ban-user-for-current-blog.handler';

@ApiBearerAuth()
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller(`blogger`)
export class BloggersController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly postsQueryRepo: PostsQueryRepositories,
    private commandBus: CommandBus,
  ) {}

  @ApiTags('Blogger-Blogs')
  @ApiOperation({
    summary: 'Returns all comments for all posts inside ll current user blogs',
  })
  @ApiOkResponsePaginated(BloggerCommentsViewModel)
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @Get(`blogs/comments`)
  async getComments(
    @CurrentUserIdBlogger() userId: string,
    @Query() paginationInputModel: PaginationCommentDto,
  ): Promise<PaginationViewDto<BloggerCommentsViewModel>> {
    return await this.postsQueryRepo.getCommentsBloggerForPosts(
      userId,
      paginationInputModel,
    );
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Update existing Blog by id with InputModel' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @HttpCode(204)
  @Put(`blogs/:blogId`)
  async updateBlog(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Body() blogInputModel: UpdateBlogDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new UpdateBlogCommand(userId, blogId, blogInputModel),
    );
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Delete blog specified by id' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @HttpCode(204)
  @Delete(`blogs/:blogId`)
  async deleteBlog(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
  ): Promise<boolean> {
    return await this.commandBus.execute(new DeleteBlogCommand(blogId, userId));
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Create new Blog' })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created blog',
    type: BloggerViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data for create blog',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'User not Unauthorized' })
  @Post(`blogs`)
  async createBlog(
    @CurrentUserIdBlogger() userId: string,
    @Body() blogInputModel: CreateBlogDto,
  ): Promise<BloggerViewModel> {
    const blogId = await this.commandBus.execute(
      new CreateBlogCommand(userId, blogInputModel),
    );
    return this.blogsQueryRepo.findBlogForBlogger(blogId);
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Returns all blogs (current blogger) with pagination' })
  @ApiOkResponsePaginated(BlogViewModel)
  @ApiResponse({ status: 401, description: 'User not Unauthorized' })
  @Get(`blogs`)
  async findBlogsForCurrentBlogger(
    @CurrentUserIdBlogger() userId: string,
    @Query() paginationInputModel: PaginationBlogDto,
  ): Promise<PaginationViewDto<BlogViewModel>> {
    return await this.blogsQueryRepo.findBlogsForCurrentBlogger(
      paginationInputModel,
      userId,
    );
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Create new Post for specified blog' })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created post',
    type: PostViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data for create post',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'User not Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @Post(`blogs/:blogId/posts`)
  async createPost(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Body() postInputModel: CreatePostDto,
  ): Promise<PostViewModel> {
    return this.commandBus.execute(new CreatePostCommand(postInputModel, blogId, userId));
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Update existing ost by id with InputModel' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data for update post',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'User not Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @HttpCode(204)
  @Put(`blogs/:blogId/posts/:postId`)
  async updatePost(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Param(`postId`, ValidateUuidPipe) postId: string,
    @Body() postInputModel: CreatePostDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new UpdatePostCommand(userId, blogId, postId, postInputModel),
    );
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Delete post specified by id blog' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 401, description: 'User not Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @Delete(`blogs/:blogId/posts/:postId`)
  @HttpCode(204)
  async deletePost(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Param(`postId`, ValidateUuidPipe) postId: string,
  ): Promise<boolean> {
    return await this.commandBus.execute(new DeletePostCommand(userId, blogId, postId));
  }

  @ApiTags('Blogger-Users')
  @ApiOperation({ summary: 'Ban/unban user' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data for update post',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'User not Unauthorized' })
  @HttpCode(204)
  @Put(`users/:id/ban`)
  async banUserForCurrentBlog(
    @CurrentUserIdBlogger() userId: string,
    @Param(`id`, ValidateUuidPipe) id: string,
    @Body() banUserForCurrentBlogInputModel: UpdateBanInfoForUserDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new UpdateBanUserForCurrentBlogCommand(userId, id, banUserForCurrentBlogInputModel),
    );
  }

  @ApiTags('Blogger-Users')
  @ApiOperation({ summary: 'Returns all banned users or blog' })
  @ApiOkResponsePaginated(UsersForBanBlogView)
  @ApiResponse({ status: 401, description: 'User not Unauthorized' })
  @Get(`users/blog/:blogId`)
  async getBanedUser(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Query() paginationInputModel: PaginationBannedUsersDto,
  ): Promise<PaginationViewDto<UsersForBanBlogView>> {
    const blog = await this.blogsQueryRepo.findBlogWithMap(blogId);
    if (!blog.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    return await this.blogsQueryRepo.getBannedUsersForBlog(blogId, paginationInputModel);
  }
}
