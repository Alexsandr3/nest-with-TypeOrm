import { IsOptional } from 'class-validator';
import { PaginationDto } from '../../../../main/common/pagination.dto';

export enum BanStatusType {
  all = 'all',
  banned = 'banned',
  notBanned = 'notBanned',
}

export class PaginationUsersDto extends PaginationDto {
  /**
   * banStatus by parameters
   */
  @IsOptional()
  banStatus?: BanStatusType = BanStatusType.all;
  /**
   * Search term for user Login: Login should contain this term in any position
   */
  @IsOptional()
  searchLoginTerm?: string = '';
  /**
   *  Search term for user Email: Email should contain this term in any position
   */
  @IsOptional()
  searchEmailTerm?: string = '';
  //
  // isSorByDefault(): string {
  //   const defaultValue = ['id', 'login', 'email', 'createdAt'];
  //   return (this.sortBy = defaultValue.includes(this.sortBy) ? this.sortBy : 'createdAt');
  // }
  //
  // getBanStatus(): string {
  //   const defaultValue = ['all', 'banned', 'notBanned'];
  //   return (this.banStatus = defaultValue.includes(this.banStatus) ? this.banStatus : BanStatusType.all);
  // }
}
