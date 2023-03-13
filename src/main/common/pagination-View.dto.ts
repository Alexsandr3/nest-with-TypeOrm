import { ApiProperty } from '@nestjs/swagger';

export class PaginationViewDto<T> {
  public pagesCount: number;
  public page: number;
  public pageSize: number;
  public totalCount: number;
  @ApiProperty({ type: 'array' })
  public items: T[];
  constructor(pagesCount: number, page: number, pageSize: number, totalCount: number, items: T[]) {
    this.pagesCount = pagesCount;
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}
