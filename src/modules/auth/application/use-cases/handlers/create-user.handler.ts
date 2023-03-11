import { CreateUserDto } from '../../../../sa-users/api/input-Dto/create-User.dto';
import { UsersRepositories } from '../../../../sa-users/infrastructure/users-repositories';
import { UsersQueryRepositories } from '../../../../sa-users/infrastructure/query-reposirory/users-query.reposit';
import { MailService } from '../../../../mail/mail.service';
import { BadRequestExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../../../sa-users/domain/users.service';
import { User } from '../../../../../entities/user.entity';
import { UserViewModel } from '../../../../sa-users/infrastructure/query-reposirory/user-view.dto';

export class CreateUserCommand {
  constructor(public readonly userInputModel: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepo: UsersRepositories,
    private readonly usersQueryRepo: UsersQueryRepositories,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserViewModel> {
    const { email, login, password } = command.userInputModel;
    //email verification and login for uniqueness
    await this.validateUser(command.userInputModel);
    //generation Hash
    const passwordHash = await this.usersService.generateHash(password);
    // preparation data User for DB
    const user = User.createUser(login, email, passwordHash, false);
    //saving created instance user
    const userId = await this.usersRepo.saveUser(user);
    //finding user for View
    const viewUser = await this.usersQueryRepo.findUser(userId);
    this.mailService.sendUserConfirmation(user.email, user.confirmationCode);
    return viewUser;
  }

  private async validateUser(userInputModel: CreateUserDto): Promise<boolean> {
    const { login, email } = userInputModel;
    //find user
    const checkEmail = await this.usersRepo.findByLoginOrEmail(email);
    if (checkEmail)
      throw new BadRequestExceptionMY({
        message: `${email}  already in use, do you need choose new data`,
        field: `email`,
      });
    ``;
    const checkLogin = await this.usersRepo.findByLoginOrEmail(login);
    if (checkLogin)
      throw new BadRequestExceptionMY({
        message: `${login}  already in use, do you need choose new data`,
        field: `login`,
      });
    return true;
  }
}
