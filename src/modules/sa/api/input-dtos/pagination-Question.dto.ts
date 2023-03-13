import { IsOptional } from 'class-validator';
import { PaginationDto } from '../../../../main/common/pagination.dto';

export enum PublishedStatusType {
  all = 'all',
  published = 'published',
  notPublished = 'notPublished',
}

export class PaginationQuestionDto extends PaginationDto {
  /**
   * banStatus by parameters
   */
  @IsOptional()
  publishedStatus?: PublishedStatusType = PublishedStatusType.all;
  /**
   * Search term for body
   */
  @IsOptional()
  bodySearchTerm?: string = '';

  isSorByDefault(): string {
    const defaultValue = ['id', 'body', 'correctAnswers', 'published', 'createdAt', 'updatedAt'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'createdAt');
  }

  getPublishedStatus(): string {
    const defaultValue = ['all', 'published', 'notPublished'];
    return (this.publishedStatus = defaultValue.includes(this.publishedStatus) ? this.publishedStatus : PublishedStatusType.all);
  }
}
