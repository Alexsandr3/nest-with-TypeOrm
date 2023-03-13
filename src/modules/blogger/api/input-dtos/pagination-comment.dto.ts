import { PaginationDto } from '../../../../main/common/pagination.dto';

export class PaginationCommentDto extends PaginationDto {
  isSorByDefault(): string {
    const defaultValue = ['id', 'content', 'createdAt'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'createdAt');
  }
}
