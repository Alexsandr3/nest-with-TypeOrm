import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../sa-users/infrastructure/users-repositories';
import { NotFoundExceptionMY } from '../../../../helpers/My-HttpExceptionFilter';

export class AuthBotLinkCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(AuthBotLinkCommand)
export class AuthBotLinkHandler implements ICommandHandler<AuthBotLinkCommand> {
  constructor(private readonly usersRepository: UsersRepositories) {}

  async execute(command: AuthBotLinkCommand) {
    const { userId } = command;
    //find user
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundExceptionMY('User not found');
    }
    //generate auth code
    user.generateAuthCode();
    await this.usersRepository.saveUser(user);
    //return link
    return { link: `code=${user.authTelegramCode}` };
  }
}
