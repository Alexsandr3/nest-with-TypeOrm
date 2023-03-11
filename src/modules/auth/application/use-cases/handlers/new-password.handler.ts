import { BadRequestExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepositories } from '../../../../sa-users/infrastructure/users-repositories';
import { UsersService } from '../../../../sa-users/domain/users.service';
import { NewPasswordDto } from '../../../api/input-dtos/new-password.dto';

export class NewPasswordCommand {
  constructor(public readonly newPasswordInputModel: NewPasswordDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordHandler implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private readonly usersRepo: UsersRepositories,
    private readonly usersService: UsersService,
  ) {}

  async execute(command: NewPasswordCommand): Promise<boolean> {
    const { newPassword, recoveryCode } = command.newPasswordInputModel;
    //search user by code
    const user = await this.usersRepo.findUserByRecoveryCode(recoveryCode);
    if (!user)
      throw new BadRequestExceptionMY({
        message: `Incorrect input data`,
        field: 'code',
      });
    //check code confirmation
    if (user.checkingConfirmCode(recoveryCode)) {
      //generation new passwordHash for save
      const passwordHash = await this.usersService.generateHash(newPassword);
      //update password
      user.updatePassword(passwordHash);
      //saved updated password
      await this.usersRepo.saveUser(user);
      return true;
    }
    throw new BadRequestExceptionMY({
      message: `Code has confirmation already`,
      field: 'code',
    });
  }
}
