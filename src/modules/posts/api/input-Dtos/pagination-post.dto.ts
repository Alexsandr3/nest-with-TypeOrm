import { IsOptional } from 'class-validator';
import { PaginationDto } from '../../../../main/common/pagination.dto';

export enum SubscriptionStatus {
  All = 'all',
  OnlyFromSubscribedBlogs = 'onlyFromSubscribedBlogs',
}

export class PaginationPostDto extends PaginationDto {
  /**
   *  Search term for blog Name: Name should contain this term in any position
   */
  @IsOptional()
  subscriptionStatus: SubscriptionStatus = SubscriptionStatus.All;

  isSorByDefault(): string {
    const defaultValue = ['id', 'title', 'shortDescription', 'content', 'blogId', 'blogName', 'createdAt'];
    return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'createdAt');
  }

  getSubscriptionStatus(): string {
    const defaultValue = ['all', 'onlyFromSubscribedBlogs'];
    return (this.subscriptionStatus = defaultValue.includes(this.subscriptionStatus)
      ? this.subscriptionStatus
      : SubscriptionStatus.All);
  }
}
