import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../domain/users.service';
import { BadRequestExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { CreateUserDto } from '../../api/input-Dto/create-User.dto';
import { UsersRepositories } from '../../infrastructure/users-repositories';
import { UsersQueryRepositories } from '../../infrastructure/query-reposirory/users-query.reposit';
import { User } from '../../../../entities/user.entity';
import { UserViewModel } from '../../infrastructure/query-reposirory/user-view.dto';

export class CreateUserSaCommand {
  constructor(public readonly userInputModel: CreateUserDto) {}
}

@CommandHandler(CreateUserSaCommand)
export class CreateUserSaHandler implements ICommandHandler<CreateUserSaCommand> {
  constructor(
    private readonly usersRepo: UsersRepositories,
    private readonly usersQueryRepo: UsersQueryRepositories,
    private readonly usersService: UsersService,
  ) {}

  async execute(command: CreateUserSaCommand): Promise<UserViewModel> {
    const { email, login, password } = command.userInputModel;
    //email verification and login for uniqueness
    await this.validateUser(command.userInputModel);
    //generation Hash
    const passwordHash = await this.usersService.generateHash(password);
    // preparation data User for DB
    const newUser = User.createUser(login, email, passwordHash, true);
    //saving created instance user
    const userId = await this.usersRepo.saveUser(newUser);
    //finding user for View
    return await this.usersQueryRepo.findUser(userId);
  }

  private async validateUser(userInputModel: CreateUserDto): Promise<boolean> {
    const { login, email } = userInputModel;
    //finding user
    const checkLogin = await this.usersRepo.findByLoginOrEmail(login);
    if (checkLogin)
      throw new BadRequestExceptionMY({
        message: `Login or Email already in use, do you need choose new data`,
        field: `login`,
      });
    const checkEmail = await this.usersRepo.findByLoginOrEmail(email);
    if (checkEmail)
      throw new BadRequestExceptionMY({
        message: `Login or Email already in use, do you need choose new data`,
        field: `email`,
      });
    return true;
  }
}
