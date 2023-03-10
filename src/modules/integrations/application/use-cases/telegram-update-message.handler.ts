import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TelegramUpdateMessage } from '../../types/telegram-update-message-type';
import { UsersRepositories } from '../../../sa-users/infrastructure/users-repositories';

export class TelegramUpdateMessageCommand {
  constructor(public readonly payload: TelegramUpdateMessage) {}
}

@CommandHandler(TelegramUpdateMessageCommand)
export class TelegramUpdateMessageHandler
  implements ICommandHandler<TelegramUpdateMessageCommand>
{
  constructor(private readonly usersRepository: UsersRepositories) {}

  async execute(command: TelegramUpdateMessageCommand) {
    const { text } = command.payload.message;
    const { id } = command.payload.message.from;
    const code = text.split('code=')[1];
    try {
      const user = await this.usersRepository.findUserByAuthTelegramCode(code);
      if (!user) {
        throw new Error('User not found');
      }
      user.updateTelegramId(id);
      await this.usersRepository.saveUser(user);
      return;
    } catch (e) {
      console.log('e', e);
    }
  }
}
