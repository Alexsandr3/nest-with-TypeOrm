import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepositories } from '../../infrastructure/device-repositories';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../main/helpers/My-HttpExceptionFilter';
import { PayloadType } from '../../../auth/application/payloadType';

export class DeleteDeviceByIdCommand {
  constructor(public readonly id: string, public readonly payloadRefresh: PayloadType) {}
}

@CommandHandler(DeleteDeviceByIdCommand)
export class DeleteDeviceByIdHandler implements ICommandHandler<DeleteDeviceByIdCommand> {
  constructor(private readonly deviceRepo: DeviceRepositories) {}

  async execute(command: DeleteDeviceByIdCommand): Promise<boolean> {
    const deviceIdForDelete = command.id;
    const { deviceId, userId } = command.payloadRefresh;
    //finding device by id from uri params
    const fondDevice = await this.deviceRepo.findDeviceByDeviceId(deviceIdForDelete);
    if (!fondDevice)
      throw new NotFoundExceptionMY(`Device with id: ${deviceId} doesn't exist`);
    //finding device by deviceId and userId
    const isUserDevice = await this.deviceRepo.findByDeviceIdAndUserId(userId, deviceId);
    if (!isUserDevice)
      throw new ForbiddenExceptionMY(`You are not the owner of the device `);
    //finding device for remove by deviceId from uri params and userId
    const deviceForDelete = await this.deviceRepo.findByDeviceIdAndUserId(
      userId,
      deviceIdForDelete,
    );
    if (!deviceForDelete)
      throw new ForbiddenExceptionMY(`You are not the owner of the device`);
    //removing device
    const isDelete = await this.deviceRepo.deleteDeviceByDeviceId(deviceIdForDelete);
    if (!isDelete) throw new ForbiddenExceptionMY(`Something went wrong`);
    return true;
  }
}
