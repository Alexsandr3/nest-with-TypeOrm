import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '../../jwt.service';
import { DeviceRepositories } from '../../../../security/infrastructure/device-repositories';
import { TokensType } from '../../tokensType.dto';
import { PayloadType } from '../../payloadType';

export class RefreshCommand {
  constructor(public readonly payloadRefresh: PayloadType) {}
}

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly deviceRepo: DeviceRepositories,
  ) {}

  async execute(command: RefreshCommand): Promise<TokensType> {
    const { userId, deviceId, iat } = command.payloadRefresh;
    //generation of a new pair of tokens
    const newTokens: TokensType = await this.jwtService.createJwt(userId, deviceId);
    const payloadNew: PayloadType = await this.jwtService.verifyRefreshToken(
      newTokens.refreshToken,
    );
    //preparation data for update device in DB
    const dateCreatedOldToken = new Date(iat * 1000).toISOString();
    const dateCreateToken = new Date(payloadNew.iat * 1000).toISOString();
    const dateExpiredToken = new Date(payloadNew.exp * 1000).toISOString();
    //finding device
    const device = await this.deviceRepo.findForUpdateDateDevice(
      userId,
      deviceId,
      dateCreatedOldToken,
    );
    //update device
    device.updateDateDevice(dateCreateToken, dateExpiredToken);
    //save device
    await this.deviceRepo.saveDevice(device);
    return newTokens;
  }
}
