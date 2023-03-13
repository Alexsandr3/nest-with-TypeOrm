import { BadRequestExceptionMY } from '../../../../main/helpers/My-HttpExceptionFilter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException } from '@nestjs/common';
import { UsersRepositories } from '../../../sa-users/infrastructure/users-repositories';
import { MailService } from '../../../mail/mail.service';
import { EmailRecoveryDto } from '../../api/input-dtos/email-recovery.dto';

export class ResendingCommand {
  constructor(public readonly resendingInputModel: EmailRecoveryDto) {}
}

@CommandHandler(ResendingCommand)
export class ResendingHandler implements ICommandHandler<ResendingCommand> {
  constructor(
    private readonly usersRepo: UsersRepositories,
    private readonly mailService: MailService,
  ) {}

  async execute(command: ResendingCommand): Promise<boolean> {
    const { email } = command.resendingInputModel;
    //search user by email
    const user = await this.usersRepo.findByLoginOrEmail(email);
    if (!user)
      throw new BadRequestExceptionMY({
        message: `Incorrect input data`,
        field: 'email',
      });
    //check code
    if (user.checkingEmail()) {
      //generation a new code
      user.updateConfirmCode();
      //save updated code confirmation
      await this.usersRepo.saveUser(user);
      try {
        //sending code to email
        await this.mailService.sendEmailRecoveryMessage(
          user.email,
          user.confirmationCode,
        );
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
      message: `Confirmation has expired`,
      field: 'email',
    });
  }
}
