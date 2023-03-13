import { Injectable } from '@nestjs/common';
import { BanStatusType, PaginationUsersDto } from '../../api/input-Dto/pagination-Users.dto';
import { PaginationViewDto } from '../../../../main/common/pagination-View.dto';
import { MeViewDto } from '../../../auth/infrastructure/me-view.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../entities/user.entity';
import { UserViewModel } from './user-view.dto';
import { BanInfoType } from './ban-info.dto';
import { ValidateValue } from '../../../../main/helpers/validate-value';

@Injectable()
export class UsersQueryRepositories {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private mappedForUser(user: User): UserViewModel {
    const banInfo = new BanInfoType(user.isBanned, user.banDate, user.banReason);
    return new UserViewModel(user.id, user.login, user.email, user.createdAt.toISOString(), banInfo);
  }

  async findUser(id: string): Promise<UserViewModel> {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) return null;
    return this.mappedForUser(user);
  }

  async findUsers(data: PaginationUsersDto): Promise<PaginationViewDto<UserViewModel>> {
    const { searchEmailTerm, searchLoginTerm, banStatus, sortBy, sortDirection, pageSize, pageNumber } = data;
    const possibleValueFilter = ['id', 'login', 'email', 'createdAt'];
    const checkedSortBy = ValidateValue.prototype.validateValue(sortBy, possibleValueFilter, 'createdAt');
    const checkedBanStatus = ValidateValue.prototype.validateEnum(banStatus, BanStatusType, BanStatusType.all);
    const checkedSortDirection = ValidateValue.prototype.validateSortDirection(sortDirection);
    const checkedPageSize = ValidateValue.prototype.validatePageSize(pageSize);
    const checkedPageNumber = ValidateValue.prototype.validatePageNumber(pageNumber);

    let filter: any = {};
    if (searchEmailTerm && searchLoginTerm) {
      filter.where = [{ login: ILike(`%${searchLoginTerm}%`) }, { email: ILike(`%${searchEmailTerm}%`) }];
    } else if (searchEmailTerm) {
      filter.where = { email: ILike(`%${searchEmailTerm}%`) };
    } else if (searchLoginTerm) {
      filter.where = { login: ILike(`%${searchLoginTerm}%`) };
    }
    if (checkedBanStatus === 'banned') {
      if (filter.where?.length) {
        filter.where = filter.where.map((e) => ({ ...e, isBanned: true }));
      } else {
        filter.where = { ...filter.where, isBanned: true };
      }
    }
    if (checkedBanStatus === 'notBanned') {
      if (filter.where?.length) {
        filter.where = filter.where.map((e) => ({ ...e, isBanned: false }));
      } else {
        filter.where = { ...filter.where, isBanned: false };
      }
    }
    const [users, count] = await this.userRepo.findAndCount({
      select: ['id', 'login', 'email', 'createdAt', 'isBanned', 'banDate', 'banReason'],
      where: filter.where,
      order: { [checkedSortBy]: checkedSortDirection },
      skip: data.skip,
      take: checkedPageSize,
    });
    //mapped user for View
    const mappedUsers = users.map((user) => this.mappedForUser(user));
    const items = await Promise.all(mappedUsers);
    const pagesCountRes = Math.ceil(count / checkedPageSize);
    // Found Users with pagination!
    return new PaginationViewDto(pagesCountRes, checkedPageNumber, checkedPageSize, count, items);
  }

  async getUserById(userId: string): Promise<MeViewDto> {
    // const user = await this.userRepo.findOneBy({
    const { email, login, id } = await this.userRepo.findOneBy({
      id: userId,
    });
    return new MeViewDto(email, login, id);
    // return { email, login, userId };
  }
}
