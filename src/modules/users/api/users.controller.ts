import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './input-Dto/create-User-Dto-Model';
import { UsersService } from '../domain/users.service';
import { UsersViewType } from '../infrastructure/query-reposirory/user-View-Model';
import { PaginationUsersDto } from './input-Dto/pagination-Users-Dto';
import { UsersQueryRepositories } from '../infrastructure/query-reposirory/users-query.reposit';
import { PaginationViewModel } from '../../../common/pagination-View-Model';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { BasicAuthGuard } from '../../../guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../application/use-cases/delete-user-command';
import { UpdateBanInfoDto } from './input-Dto/update-ban-info-Dto-Model';
import { UpdateBanInfoCommand } from '../application/use-cases/updateBanInfoCommand';
import { CreateUserSaCommand } from '../application/use-cases/create-user-sa-command';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller(`sa/users`)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepositories: UsersQueryRepositories,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(`/:userId/ban`)
  async updateBanInfo(
    @Body() updateBanInfoModel: UpdateBanInfoDto,
    @Param(`userId`, ValidateUuidPipe) userId: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new UpdateBanInfoCommand(updateBanInfoModel, userId));
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() userInputModel: CreateUserDto): Promise<UsersViewType> {
    return this.commandBus.execute(new CreateUserSaCommand(userInputModel));
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUsers(
    @Query() paginationInputModel: PaginationUsersDto,
  ): Promise<PaginationViewModel<UsersViewType[]>> {
    return this.usersQueryRepositories.findUsers(paginationInputModel);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(`:userId`)
  async deleteUser(@Param(`userId`, ValidateUuidPipe) userId: string): Promise<boolean> {
    return await this.commandBus.execute(new DeleteUserCommand(userId));
  }
}
