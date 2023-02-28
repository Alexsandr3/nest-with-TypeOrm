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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from '../../posts/api/input-Dtos/create-post.dto';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { PostViewModel } from '../../posts/infrastructure/query-repositories/post-view.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/use-cases/create-blog.command';
import { DeleteBlogCommand } from '../application/use-cases/delete-blog.command';
import { UpdateBlogCommand } from '../application/use-cases/update-blog.command';
import { CreatePostCommand } from '../application/use-cases/create-post.command';
import { BlogsQueryRepositories } from '../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { JwtAuthGuard } from '../../../guards/jwt-auth-bearer.guard';
import { PaginationBlogDto } from './input-dtos/pagination-blog.dto';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { UpdatePostCommand } from '../application/use-cases/update-post.command';
import { DeletePostCommand } from '../application/use-cases/delete-post.command';
import { CurrentUserIdBlogger } from '../../../decorators/current-user-id.param.decorator';
import { CreateBlogDto } from './input-dtos/create-blog.dto';
import { UpdateBlogDto } from './input-dtos/update-blog.dto';
import { UpdateBanInfoForUserDto } from './input-dtos/update-ban-info-for-user.dto';
import { UpdateBanUserForCurrentBlogCommand } from '../application/use-cases/update-ban-User-For-Current-Blog.command';
import { PostsQueryRepositories } from '../../posts/infrastructure/query-repositories/posts-query.reposit';
import { ForbiddenExceptionMY } from '../../../helpers/My-HttpExceptionFilter';
import { SkipThrottle } from '@nestjs/throttler';
import { PaginationBannedUsersDto } from './input-dtos/pagination-banned-users.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResultDto } from '../../../common/api-error-result.dto';
import { BlogViewModel } from '../../blogs/infrastructure/query-repository/blog-view.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import { BloggerCommentsViewModel } from '../../comments/infrastructure/query-repository/comments-view.dto';
import { UsersForBanBlogView } from '../../sa-users/infrastructure/query-reposirory/user-ban-for-blog-view.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageWallpaperCommand } from '../application/use-cases/upload-image-wallpaper.command';
import { BlogImagesViewModel } from '../infrastructure/blog-images-view.dto';
import { UploadImageMainCommand } from '../application/use-cases/upload-image-main.command';
import { FileSizeValidationImageMainPipe } from '../../../validators/file-size-validation-image-main.pipe';
import { FileSizeValidationImageWallpaperPipe } from '../../../validators/file-size-validation-image-wallpaper.pipe';
import { UploadImageMainPostCommand } from '../application/use-cases/upload-image-main-post.command';
import { FileSizeValidationImageMainPostPipe } from '../../../validators/file-size-validation-image-main-post.pipe';
import { PostImagesViewModel } from '../infrastructure/post-images-view.dto';
import { BloggerViewModel } from '../../blogs/infrastructure/query-repository/blogger-view.dto';
import { PaginationCommentDto } from './input-dtos/pagination-comment.dto';

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

  // @ApiTags('images')
  // @ApiOperation({
  //   summary:
  //     'Upload background wallpaper for Blog (.png or jpg (.ipeg) file (max size is 100KB, width must be 1028, height must be\n' +
  //     '312px))',
  // })
  // @ApiResponse({ status: 200, description: 'Uploaded image information object', type: BlogImagesViewModel })
  // @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @Post('blogs/:blogId/images/wallpaper')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // 👈 this property
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadPhotoWallpaper(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    // @UploadedFile() file: Express.Multer.File,
    @UploadedFile(FileSizeValidationImageWallpaperPipe) file: Express.Multer.File,
  ) {
    console.log('--------------------------------file', file);
    return await this.commandBus.execute(new UploadImageWallpaperCommand(userId, blogId, file.originalname, file.buffer));
  }

  @ApiTags('images')
  @ApiOperation({
    summary:
      'Upload main square image for Blog (.png or jpg (jpeg) file (max size is 100KB, width must be 156, height must be 156))',
  })
  @ApiResponse({ status: 200, description: 'Uploaded image information object', type: BlogImagesViewModel })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @Post('blogs/:blogId/images/main')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // 👈 this property
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadPhotoMain(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @UploadedFile(FileSizeValidationImageMainPipe) file: Express.Multer.File,
  ) {
    return await this.commandBus.execute(new UploadImageMainCommand(userId, blogId, file.originalname, file.buffer));
  }

  @ApiTags('images')
  @ApiOperation({
    summary:
      'Upload main image for Post (.png or jpg (.jpeg) file (max size is\n' + '100KB, width must be 940, height must be 432))',
  })
  @ApiResponse({ status: 200, description: 'Uploaded image information object', type: PostImagesViewModel })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @Post('blogs/:blogId/posts/:postId/images/main')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          // 👈 this property
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadPhotoMainPost(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Param(`postId`, ValidateUuidPipe) postId: string,
    @UploadedFile(FileSizeValidationImageMainPostPipe) file: Express.Multer.File,
  ): Promise<PostImagesViewModel> {
    return await this.commandBus.execute(new UploadImageMainPostCommand(userId, blogId, postId, file.originalname, file.buffer));
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Returns all comments for all posts inside ll current user blogs' })
  @ApiOkResponsePaginated(BloggerCommentsViewModel)
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @Get(`blogs/comments`)
  async getComments(
    @CurrentUserIdBlogger() userId: string,
    @Query() paginationInputModel: PaginationCommentDto,
  ): Promise<PaginationViewDto<BloggerCommentsViewModel>> {
    return await this.postsQueryRepo.getCommentsBloggerForPosts(userId, paginationInputModel);
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Update existing Blog by id with InputModel' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @HttpCode(204)
  @Put(`blogs/:blogId`)
  async updateBlog(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Body() blogInputModel: UpdateBlogDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(new UpdateBlogCommand(userId, blogId, blogInputModel));
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Delete blog specified by id' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @HttpCode(204)
  @Delete(`blogs/:blogId`)
  async deleteBlog(@CurrentUserIdBlogger() userId: string, @Param(`blogId`, ValidateUuidPipe) blogId: string): Promise<boolean> {
    return await this.commandBus.execute(new DeleteBlogCommand(blogId, userId));
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Create new Blog' })
  @ApiResponse({ status: 201, description: 'Returns the newly created blog', type: BloggerViewModel })
  @ApiResponse({ status: 400, description: 'Incorrect input data for create blog', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'User not Unauthorized' })
  @Post(`blogs`)
  async createBlog(@CurrentUserIdBlogger() userId: string, @Body() blogInputModel: CreateBlogDto): Promise<BloggerViewModel> {
    const blogId = await this.commandBus.execute(new CreateBlogCommand(userId, blogInputModel));
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
    return await this.blogsQueryRepo.findBlogsForCurrentBlogger(paginationInputModel, userId);
  }

  @ApiTags('Blogger-Blogs')
  @ApiOperation({ summary: 'Create new Post for specified blog' })
  @ApiResponse({ status: 201, description: 'Returns the newly created post', type: PostViewModel })
  @ApiResponse({ status: 400, description: 'Incorrect input data for create post', type: ApiErrorResultDto })
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
  @ApiResponse({ status: 400, description: 'Incorrect input data for update post', type: ApiErrorResultDto })
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
    return await this.commandBus.execute(new UpdatePostCommand(userId, blogId, postId, postInputModel));
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
  @ApiResponse({ status: 400, description: 'Incorrect input data for update post', type: ApiErrorResultDto })
  @ApiResponse({ status: 401, description: 'User not Unauthorized' })
  @HttpCode(204)
  @Put(`users/:id/ban`)
  async banUserForCurrentBlog(
    @CurrentUserIdBlogger() userId: string,
    @Param(`id`, ValidateUuidPipe) id: string,
    @Body() banUserForCurrentBlogInputModel: UpdateBanInfoForUserDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(new UpdateBanUserForCurrentBlogCommand(userId, id, banUserForCurrentBlogInputModel));
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
    if (!blog.checkOwner(userId)) throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    return await this.blogsQueryRepo.getBannedUsersForBlog(blogId, paginationInputModel);
  }
}
