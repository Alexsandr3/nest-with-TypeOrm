import { BadRequestExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException } from '@nestjs/common';
import { UsersRepositories } from '../../../../sa-users/infrastructure/users-repositories';
import { MailService } from '../../../../mail/mail.service';
import { EmailRecoveryDto } from '../../../api/input-dtos/email-recovery.dto';

export class RecoveryCommand {
  constructor(public readonly emailInputModel: EmailRecoveryDto) {}
}

@CommandHandler(RecoveryCommand)
export class RecoveryHandler implements ICommandHandler<RecoveryCommand> {
  constructor(
    private readonly usersRepo: UsersRepositories,
    private readonly mailService: MailService,
  ) {}

  async execute(command: RecoveryCommand): Promise<boolean> {
    const { email } = command.emailInputModel;
    //search user by login or email
    const user = await this.usersRepo.findByLoginOrEmail(email);
    if (!user)
      throw new BadRequestExceptionMY({
        message: `${email} has invalid`,
        field: 'email',
      });
    //check code confirmation
    if (user.checkingEmail()) {
      //generate new code
      user.updateRecoveryCode();
      //save updated code recovery
      await this.usersRepo.saveUser(user);
      try {
        await this.mailService.sendPasswordRecoveryMessage(user.email, user.recoveryCode);
      } catch (error) {
        console.error(error);
        throw new HttpException(
          'Service is unavailable. Please try again later. We need saved User',
          421,
        );
      }
      return true;
    }
    throw new BadRequestExceptionMY({
      message: `Incorrect input data by field #email`,
      field: 'email',
    });
  }
}
