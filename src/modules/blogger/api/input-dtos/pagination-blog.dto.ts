import { IsOptional } from 'class-validator';
import { PaginationDto } from '../../../../main/common/pagination.dto';

export class PaginationBlogDto extends PaginationDto {
  /**
   *  Search term for blog Name: Name should contain this term in any position
   */
  @IsOptional()
  searchNameTerm?: string = '';

  isSortByDefault(): string {
    const defaultValue = ['id', 'name', 'description', 'websiteUrl', 'createdAt', 'isMembership', 'subscribersCount'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'createdAt');
  }
}
