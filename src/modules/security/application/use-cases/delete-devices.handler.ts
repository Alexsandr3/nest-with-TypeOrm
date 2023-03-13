import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepositories } from '../../infrastructure/device-repositories';
import { PayloadType } from '../../../auth/application/payloadType';

export class DeleteDevicesCommand {
  constructor(public readonly payloadRefresh: PayloadType) {}
}

@CommandHandler(DeleteDevicesCommand)
export class DeleteDevicesHandler implements ICommandHandler<DeleteDevicesCommand> {
  constructor(private readonly deviceRepo: DeviceRepositories) {}

  async execute(command: DeleteDevicesCommand): Promise<boolean> {
    const { userId, deviceId } = command.payloadRefresh;
    await this.deviceRepo.deleteDevices(userId, deviceId);
    return true;
  }
}
