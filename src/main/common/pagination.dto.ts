import { IsOptional } from 'class-validator';

export enum SortDirectionType {
  Asc = 'asc',
  Desc = 'desc',
}

export class PaginationDto {
  /**
   * pageSize is portions size that should be returned
   */
  @IsOptional()
  pageSize?: number;
  /**
   *  pageNumber is number of portions that should be returned
   */
  @IsOptional()
  pageNumber?: number;
  /**
   * Sort by parameters
   */
  @IsOptional()
  sortBy?: string;
  /**
   * Sort by desc or asc
   */
  @IsOptional()
  sortDirection?: SortDirectionType = SortDirectionType.Desc;

  get skip(): number {
    return this.getPageSize() * (this.getPageNumber() - 1);
  }

  isSortDirection(): 'ASC' | 'DESC' {
    return this.sortDirection === SortDirectionType.Asc ? 'ASC' : 'DESC';
  }

  getPageSize(): number {
    if (isNaN(this.pageSize)) {
      return (this.pageSize = 10);
    }
    if (this.pageSize < 1) {
      return (this.pageSize = 10);
    }
    return this.pageSize;
  }

  getPageNumber(): number {
    if (isNaN(this.pageNumber)) {
      return (this.pageNumber = 1);
    }
    if (this.pageNumber < 1) {
      return (this.pageNumber = 1);
    }
    return this.pageNumber;
  }
}
