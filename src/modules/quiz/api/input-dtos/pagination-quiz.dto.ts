import { PaginationDto } from '../../../../main/common/pagination.dto';

export class PaginationQuizDto extends PaginationDto {
  isSorByDefault(): string {
    const defaultValue = ['id', 'status', 'pairCreatedDate', 'startGameDate', 'finishGameDate'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'pairCreatedDate');
  }
}
