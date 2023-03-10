import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { BlogsQueryRepositories } from '../infrastructure/query-repository/blogs-query.repositories';
import { PaginationBlogDto } from '../../blogger/api/input-dtos/pagination-blog.dto';
import { PaginationViewDto } from '../../../common/pagination-View.dto';
import { PostsQueryRepositories } from '../../posts/infrastructure/query-repositories/posts-query.reposit';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { PostViewModel } from '../../posts/infrastructure/query-repositories/post-view.dto';
import { CurrentUserId } from '../../../decorators/current-user-id.param.decorator';
import { JwtForGetGuard } from '../../../guards/jwt-auth-bearer-for-get.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogViewModel } from '../infrastructure/query-repository/blog-view.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import { PaginationPostDto } from '../../posts/api/input-Dtos/pagination-post.dto';

@ApiTags('Blogs')
@SkipThrottle()
@Controller(`blogs`)
export class BlogsGetController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly postsQueryRepo: PostsQueryRepositories,
  ) {}

  @ApiOperation({ summary: 'Returns blogs with pagination' })
  @ApiOkResponsePaginated(BlogViewModel)
  @ApiResponse({ status: 200, description: 'success', type: BlogViewModel })
  @UseGuards(JwtForGetGuard)
  @Get()
  async findBlogs(
    @CurrentUserId() userId: string,
    @Query() paginationInputModel: PaginationBlogDto,
  ): Promise<PaginationViewDto<BlogViewModel>> {
    return await this.blogsQueryRepo.findBlogs(paginationInputModel, userId);
  }

  @ApiOperation({
    summary: 'Returns all posts for specified blog with pagination',
  })
  @ApiOkResponsePaginated(PostViewModel)
  @ApiResponse({ status: 200, description: 'success', type: PostViewModel })
  @UseGuards(JwtForGetGuard)
  @Get(`:blogId/posts`)
  async findPosts(
    @CurrentUserId() userId: string,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Query() paginationInputModel: PaginationPostDto,
  ): Promise<PaginationViewDto<PostViewModel>> {
    await this.blogsQueryRepo.findBlog(blogId, userId);
    return this.postsQueryRepo.findPosts(paginationInputModel, blogId);
  }

  @ApiOperation({ summary: 'Returns blog by id' })
  @ApiResponse({ status: 200, description: 'success', type: BlogViewModel })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @UseGuards(JwtForGetGuard)
  @Get(`:id`)
  async findOne(
    @CurrentUserId() userId: string,
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<BlogViewModel> {
    return await this.blogsQueryRepo.findBlog(id, userId);
  }
}

/*
 @Get('/photo/ph')
 async getPhoto() {
   return await readTextFileAsync(path.join('views', 'photo.html'));
 }

//test points ---------------------------------------------
 @Get('/photo/delete')
 async deletePhoto() {
   const userId = '77777';
   const key = `main/${userId}.png`;
   return await this.s3.delete(userId, key);
 }

 @Post('photo/save')
 @UseInterceptors(FileInterceptor('photo'))
 @ApiConsumes('multipart/form-data')
 @ApiBody({
   schema: {
     type: 'object',
     properties: {
       photo: {
         type: 'string',
         format: 'binary',
       },
     },
   },
 })
 @ApiResponse({ status: 400, description: 'The inputModel has incorrect values', type: ApiErrorResultDto })
 async createPhoto(@UploadedFile() photoFile: Express.Multer.File) {
   const userId = '77777';
   const key = `main/${userId}.png`;
   console.log('photoFile', photoFile);
   return await this.s3.saveFile(userId, photoFile.buffer, key);
 }*/
