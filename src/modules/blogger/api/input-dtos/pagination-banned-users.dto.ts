import { IsOptional } from 'class-validator';
import { PaginationDto } from '../../../../main/common/pagination.dto';

export class PaginationBannedUsersDto extends PaginationDto {
  /**
   * Search term for user Login: Login should contain this term in any position
   */
  @IsOptional()
  searchLoginTerm?: string = '';

  isSorByDefault() {
    const defaultValue = ['id', 'login', 'banInfo'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'createdAt');
  }
}
