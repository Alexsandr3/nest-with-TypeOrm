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
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepositories } from '../../blogs/infrastructure/query-repository/blogs-query.repositories';
import { PaginationBlogDto } from '../../blogger/api/input-dtos/pagination-blog.dto';
import { PaginationViewDto } from '../../../main/common/pagination-View.dto';
import { BasicAuthGuard } from '../../../main/guards/basic-auth.guard';
import { ValidateUuidPipe } from '../../../main/validators/id-validation-pipe';
import { UpdateBanInfoForBlogDto } from './input-dtos/update-ban-info-for-blog.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateQuestionDto } from './input-dtos/create-Question.dto';
import { QuestionForSaViewModel } from '../infrastructure/query-reposirory/question-for-sa-view.dto';
import { PublisherQuestionDto } from './input-dtos/publisher-question.dto';
import { PaginationQuestionDto } from './input-dtos/pagination-Question.dto';
import { QuestionQueryRepository } from '../infrastructure/query-reposirory/question-query.reposit';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResultDto } from '../../../main/common/api-error-result.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import { BlogViewForSaModel } from '../../blogs/infrastructure/query-repository/blog-view-for-sa.dto';
import { BindBlogCommand } from '../application/use-cases/bind-blog.handler';
import { UpdateBanBlogSaCommand } from '../application/use-cases/update-ban-blog-sa.handler';
import { CreateQuestionCommand } from '../application/use-cases/create-question.handler';
import { DeleteQuestionCommand } from '../application/use-cases/delete-question.handler';
import { UpdateQuestionCommand } from '../application/use-cases/update-question.handler';
import { PublishQuestionCommand } from '../application/use-cases/publish-question.handler';

@ApiBasicAuth()
@SkipThrottle()
@UseGuards(BasicAuthGuard)
@Controller(`sa`)
export class SaController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepositories,
    private readonly questionQueryRepo: QuestionQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiTags('Sa-Blogs')
  @ApiOperation({ summary: 'Ban/unban blog' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(204)
  @Put(`blogs/:blogId/ban`)
  async updateBanInfoForBlog(
    @Body() updateBanInfoForBlogModel: UpdateBanInfoForBlogDto,
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
  ): Promise<boolean> {
    return this.commandBus.execute(
      new UpdateBanBlogSaCommand(updateBanInfoForBlogModel, blogId),
    );
  }

  @ApiTags('Sa-Blogs')
  @ApiOperation({ summary: `Bind Blog with User (if blog doesn't have n owner yet)` })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(204)
  @Put(`blogs/:blogId/bind-with-user/:userId`)
  async bindBlog(
    @Param(`blogId`, ValidateUuidPipe) blogId: string,
    @Param(`userId`, ValidateUuidPipe) userId: string,
  ): Promise<boolean> {
    return await this.commandBus.execute(new BindBlogCommand(blogId, userId));
  }

  @ApiTags('Sa-Blogs')
  @ApiOperation({ summary: 'Returns all blogs with pagination' })
  @ApiOkResponsePaginated(BlogViewForSaModel)
  @ApiResponse({ status: 200, description: 'The found record', type: BlogViewForSaModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(`blogs`)
  async findBlogsForSa(
    @Query() paginationInputModel: PaginationBlogDto,
  ): Promise<PaginationViewDto<BlogViewForSaModel>> {
    return await this.blogsQueryRepo.findBlogsForSa(paginationInputModel);
  }

  @ApiTags('Sa-QuizQuestions')
  @ApiOperation({ summary: 'Returns all questions with pagination and filtering' })
  @ApiOkResponsePaginated(QuestionForSaViewModel)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: QuestionForSaViewModel,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(`quiz/questions`)
  async getQuestions(
    @Query() paginationInputModel: PaginationQuestionDto,
  ): Promise<PaginationViewDto<QuestionForSaViewModel>> {
    return await this.questionQueryRepo.getQuestions(paginationInputModel);
  }

  @ApiTags('Sa-QuizQuestions')
  @ApiOperation({ summary: 'Create question' })
  @ApiResponse({ status: 201, description: 'success', type: QuestionForSaViewModel })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post(`quiz/questions`)
  async createQuestion(
    @Body() questionInputModel: CreateQuestionDto,
  ): Promise<QuestionForSaViewModel> {
    return this.commandBus.execute(new CreateQuestionCommand(questionInputModel));
  }

  @ApiTags('Sa-QuizQuestions')
  @ApiOperation({ summary: 'Delete question' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found the question by id' })
  @HttpCode(204)
  @Delete(`quiz/questions/:id`)
  async deleteQuestion(@Param(`id`, ValidateUuidPipe) id: string): Promise<boolean> {
    return await this.commandBus.execute(new DeleteQuestionCommand(id));
  }

  @ApiTags('Sa-QuizQuestions')
  @ApiOperation({ summary: 'Update question' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found the question by id' })
  @HttpCode(204)
  @Put(`quiz/questions/:id`)
  async updateQuestion(
    @Body() questionInputModel: CreateQuestionDto,
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new UpdateQuestionCommand(id, questionInputModel));
  }

  @ApiTags('Sa-QuizQuestions')
  @ApiOperation({ summary: 'Publish/unpublish question' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(204)
  @Put(`quiz/questions/:id/publish`)
  async publishQuestion(
    @Param(`id`, ValidateUuidPipe) id: string,
    @Body() publishInputModel: PublisherQuestionDto,
  ): Promise<boolean> {
    return this.commandBus.execute(new PublishQuestionCommand(id, publishInputModel));
  }
}
