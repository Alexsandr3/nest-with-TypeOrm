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
import { CreateUserDto } from './input-Dto/create-User.dto';
import { UsersService } from '../domain/users.service';
import { PaginationUsersDto } from './input-Dto/pagination-Users.dto';
import { UsersQueryRepositories } from '../infrastructure/query-reposirory/users-query.reposit';
import { PaginationViewDto } from '../../../main/common/pagination-View.dto';
import { ValidateUuidPipe } from '../../../main/validators/id-validation-pipe';
import { BasicAuthGuard } from '../../../main/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateBanInfoDto } from './input-Dto/update-ban-info.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiErrorResultDto } from '../../../main/common/api-error-result.dto';
import { UserViewModel } from '../infrastructure/query-reposirory/user-view.dto';
import { ApiOkResponsePaginated } from '../../../swagger/ApiOkResponsePaginated';
import { BanUserSaCommand } from '../application/use-cases/ban-user-sa.handler';
import { CreateUserSaCommand } from '../application/use-cases/create-user-sa.handler';
import { DeleteUserCommand } from '../application/use-cases/delete-user.handler';

@ApiBasicAuth()
@ApiTags('Sa-Users')
@SkipThrottle()
@UseGuards(BasicAuthGuard)
@Controller(`sa/users`)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepositories: UsersQueryRepositories,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: 'Ban/unban user' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 400,
    description: 'The inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(204)
  @Put(`/:userId/ban`)
  async updateBanInfo(
    @Body() updateBanInfoModel: UpdateBanInfoDto,
    @Param(`userId`, ValidateUuidPipe) userId: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new BanUserSaCommand(updateBanInfoModel, userId));
  }

  @ApiOperation({ summary: 'Returns all users with pagination' })
  @ApiOkResponsePaginated(UserViewModel)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async findUsers(
    @Query() paginationInputModel: PaginationUsersDto,
  ): Promise<PaginationViewDto<UserViewModel>> {
    return this.usersQueryRepositories.findUsers(paginationInputModel);
  }

  @ApiOperation({ summary: 'Add new user o the system' })
  @ApiResponse({ status: 201, description: 'create new user', type: UserViewModel })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  async createUser(@Body() userInputModel: CreateUserDto): Promise<UserViewModel> {
    return this.commandBus.execute(new CreateUserSaCommand(userInputModel));
  }

  @ApiOperation({ summary: 'Delete user specified by id' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found the user by id' })
  @HttpCode(204)
  @Delete(`:userId`)
  async deleteUser(@Param(`userId`, ValidateUuidPipe) userId: string): Promise<boolean> {
    return await this.commandBus.execute(new DeleteUserCommand(userId));
  }
}
