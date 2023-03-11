import {
  Controller,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepositories } from '../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { JwtAuthGuard } from '../../../guards/jwt-auth-bearer.guard';
import { CurrentUserIdBlogger } from '../../../decorators/current-user-id.param.decorator';
import { PostsQueryRepositories } from '../../posts/infrastructure/query-repositories/posts-query.reposit';
import { SkipThrottle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorResultDto } from '../../../common/api-error-result.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogImagesViewModel } from '../infrastructure/blog-images-view.dto';
import { FileSizeValidationImageMainPipe } from '../../../validators/file-size-validation-image-main.pipe';
import { FileSizeValidationImageWallpaperPipe } from '../../../validators/file-size-validation-image-wallpaper.pipe';
import { FileSizeValidationImageMainPostPipe } from '../../../validators/file-size-validation-image-main-post.pipe';
import { PostImagesViewModel } from '../infrastructure/post-images-view.dto';
import { UploadImageWallpaperCommand } from '../application/use-cases/upload-image-wallpaper.handler';
import { UploadImageMainCommand } from '../application/use-cases/upload-image-main.handler';
import { UploadImageMainPostCommand } from '../application/use-cases/upload-image-main-post.handler';

@ApiBearerAuth()
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller(`blogger`)
export class BloggersImagesController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly postsQueryRepo: PostsQueryRepositories,
    private commandBus: CommandBus,
  ) {}

  @ApiTags('images')
  @ApiOperation({
    summary:
      'Upload background wallpaper for Blog (.png or jpg (.ipeg) file (max size is 100KB, width must be 1028, height must be\n' +
      '312px))',
  })
  @ApiResponse({
    status: 200,
    description: 'Uploaded image information object',
    type: BlogImagesViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @Post('blogs/:blogId/images/wallpaper')
  @HttpCode(201)
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
  async uploadPhotoWallpaper(
    @CurrentUserIdBlogger() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @UploadedFile(FileSizeValidationImageWallpaperPipe) file: Express.Multer.File,
  ) {
    return await this.commandBus.execute(
      new UploadImageWallpaperCommand(userId, blogId, file.mimetype, file.buffer),
    );
  }

  @ApiTags('images')
  @ApiOperation({
    summary:
      'Upload main square image for Blog (.png or jpg (jpeg) file (max size is 100KB, width must be 156, height must be 156))',
  })
  @ApiResponse({
    status: 200,
    description: 'Uploaded image information object',
    type: BlogImagesViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @Post('blogs/:blogId/images/main')
  @HttpCode(201)
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
    return await this.commandBus.execute(
      new UploadImageMainCommand(userId, blogId, file.mimetype, file.buffer),
    );
  }

  @ApiTags('images')
  @ApiOperation({
    summary:
      'Upload main image for Post (.png or jpg (.jpeg) file (max size is\n' +
      '100KB, width must be 940, height must be 432))',
  })
  @ApiResponse({
    status: 200,
    description: 'Uploaded image information object',
    type: PostImagesViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You are not the owner of the blog' })
  @Post('blogs/:blogId/posts/:postId/images/main')
  @HttpCode(201)
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
    return await this.commandBus.execute(
      new UploadImageMainPostCommand(userId, blogId, postId, file.mimetype, file.buffer),
    );
  }
}
