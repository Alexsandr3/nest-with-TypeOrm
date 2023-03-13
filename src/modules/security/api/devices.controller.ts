import { Controller, Delete, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { DeviceQueryRepositories } from '../infrastructure/query-repository/device-query.repositories';
import { RefreshGuard } from '../../../main/guards/jwt-auth-refresh.guard';
import { DeviceViewModel } from '../infrastructure/query-repository/device-view.dto';
import { PayloadRefresh } from '../../../main/decorators/payload-refresh.param.decorator';
import { PayloadType } from '../../auth/application/payloadType';
import { CurrentUserIdDevice } from '../../../main/decorators/current-device.param.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { SkipThrottle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteDevicesCommand } from '../application/use-cases/delete-devices.handler';
import { DeleteDeviceByIdCommand } from '../application/use-cases/delete-device-by-id.handler';

@ApiTags('SecurityDevices')
@ApiBearerAuth()
@UseGuards(RefreshGuard)
@SkipThrottle()
@Controller(`security`)
export class DevicesController {
  constructor(
    private commandBus: CommandBus,
    private readonly deviceQueryRepositories: DeviceQueryRepositories,
  ) {}

  @ApiOperation({ summary: 'Returns all devices with active sessions for current user' })
  @ApiOkResponse({
    status: 200,
    description: 'success',
    type: DeviceViewModel,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @Get(`/devices`)
  async findDevices(@CurrentUserIdDevice() userId: string): Promise<DeviceViewModel[]> {
    return await this.deviceQueryRepositories.findDevices(userId);
  }

  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 401,
    description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @ApiOperation({ summary: "Terminate all other (exclude current) device's sessions" })
  @HttpCode(204)
  @Delete(`/devices`)
  async deleteDevices(@PayloadRefresh() payloadRefresh: PayloadType): Promise<boolean> {
    return await this.commandBus.execute(new DeleteDevicesCommand(payloadRefresh));
  }

  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 401,
    description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @ApiResponse({ status: 403, description: 'You are not the owner of the device ' })
  @ApiResponse({ status: 404, description: 'Not found post' })
  @ApiOperation({ summary: 'Terminate specified device session' })
  @HttpCode(204)
  @Delete(`/devices/:deviceId`)
  async deleteByDeviceId(
    @PayloadRefresh() payloadRefresh: PayloadType,
    @Param(`deviceId`) deviceId: string,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new DeleteDeviceByIdCommand(deviceId, payloadRefresh),
    );
  }
}
