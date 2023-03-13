import { BadRequestExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../sa-users/infrastructure/users-repositories';
import { ConfirmationCodeDto } from '../../api/input-dtos/confirmation-code.dto';

export class ConfirmByCodeCommand {
  constructor(public readonly codeInputModel: ConfirmationCodeDto) {}
}

@CommandHandler(ConfirmByCodeCommand)
export class ConfirmByCodeHandler implements ICommandHandler<ConfirmByCodeCommand> {
  constructor(private readonly usersRepo: UsersRepositories) {}

  async execute(command: ConfirmByCodeCommand): Promise<boolean> {
    const { code } = command.codeInputModel;
    //finding user by code
    const user = await this.usersRepo.findUserByConfirmationCode(code);

    if (!user)
      throw new BadRequestExceptionMY({
        message: `Invalid code, user already registered`,
        field: 'code',
      });
    if (user.checkingConfirmCode(code)) {
      //update status code-> true
      user.updateStatusConfirmCode();
      await this.usersRepo.saveUser(user);
      return true;
    }
    throw new BadRequestExceptionMY({
      message: `Code has confirmation already`,
      field: 'code',
    });
  }
}
