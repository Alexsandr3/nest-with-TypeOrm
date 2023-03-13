import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionForSaViewModel } from './question-for-sa-view.dto';
import { Question } from '../../../../entities/question.entity';
import { PaginationViewDto } from '../../../../main/common/pagination-View.dto';
import { PaginationQuestionDto } from '../../api/input-dtos/pagination-Question.dto';

@Injectable()
export class QuestionQueryRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  private mappedForQuestion(question: Question): QuestionForSaViewModel {
    return new QuestionForSaViewModel(
      question.id,
      question.body,
      question.correctAnswers,
      question.published,
      question.createdAt.toISOString(),
      question.updatedAt ? question.updatedAt.toISOString() : null,
    );
  }

  async findQuestion(questionId: string): Promise<QuestionForSaViewModel> {
    const user = await this.questionRepo.findOneBy({ id: questionId });
    if (!user) return null;
    return this.mappedForQuestion(user);
  }

  async getQuestions(data: PaginationQuestionDto): Promise<PaginationViewDto<QuestionForSaViewModel>> {
    const { bodySearchTerm } = data;
    let filter = {};
    if (data.getPublishedStatus() === 'notPublished') {
      filter = { published: false };
    }
    if (data.getPublishedStatus() === 'published') {
      filter = { published: true };
    }
    if (bodySearchTerm.trim().length > 0) {
      filter = { body: ILike(`%${bodySearchTerm}%`) };
    }
    //search all blogs for current user and counting
    const [question, count] = await Promise.all([
      this.questionRepo.find({
        select: ['id', 'body', 'correctAnswers', 'published', 'createdAt', 'updatedAt'],
        where: filter,
        order: { [data.isSorByDefault()]: data.isSortDirection() },
        skip: data.skip,
        take: data.getPageSize(),
      }),
      this.questionRepo.count({ where: filter }),
    ]);
    //mapped for View
    const mappedBlogs = question.map((q) => this.mappedForQuestion(q));
    const pagesCountRes = Math.ceil(count / data.getPageSize());
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, data.getPageNumber(), data.getPageSize(), count, mappedBlogs);
  }
}
