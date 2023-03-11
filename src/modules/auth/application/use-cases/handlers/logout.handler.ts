import { UnauthorizedExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepositories } from '../../../../security/infrastructure/device-repositories';
import { PayloadType } from '../../payloadType';

export class LogoutCommand {
  constructor(public readonly payloadRefresh: PayloadType) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly deviceRepo: DeviceRepositories) {}

  async execute(command: LogoutCommand): Promise<boolean> {
    const { userId, deviceId, iat } = command.payloadRefresh;
    const dateCreatedToken = new Date(iat * 1000).toISOString();
    //search device
    const foundDevice = await this.deviceRepo.findDeviceForDelete(
      userId,
      deviceId,
      dateCreatedToken,
    );
    if (!foundDevice) throw new UnauthorizedExceptionMY('not today sorry man');
    //removing device
    const isDeleted = await this.deviceRepo.deleteDevice(userId, deviceId);
    if (!isDeleted) throw new UnauthorizedExceptionMY('not today');
    return true;
  }
}
