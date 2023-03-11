import { UnauthorizedExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepositories } from '../../../../security/infrastructure/device-repositories';
import { JwtService } from '../../jwt.service';
import { UsersRepositories } from '../../../../sa-users/infrastructure/users-repositories';
import { randomUUID } from 'crypto';
import { Device } from '../../../../../entities/device.entity';
import { TokensType } from '../../tokensType.dto';
import { LoginDto } from '../../../api/input-dtos/login.dto';

export class LoginCommand {
  constructor(
    public readonly loginInputModel: LoginDto,
    public readonly ip: string,
    public readonly deviceName: string,
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly deviceRepo: DeviceRepositories,
    private readonly usersRepo: UsersRepositories,
  ) {}

  async execute(command: LoginCommand): Promise<TokensType> {
    const { password, loginOrEmail } = command.loginInputModel;
    const ipAddress = command.ip;
    const deviceName = command.deviceName;
    //validate user by login or email
    const user = await this.usersRepo.findByLoginOrEmail(loginOrEmail);
    if (!user)
      throw new UnauthorizedExceptionMY(`User '${loginOrEmail}' is not authorized `);
    //check passwordHash
    if (await user.comparePassword(password)) {
      if (user.checkStatusBan()) {
        //deleting a devices-sessions if the user is banned
        await this.deviceRepo.deleteDevicesForBannedUser(user.id);
        throw new UnauthorizedExceptionMY(`Did you get a ban!`);
      }
      //preparation data for token
      const deviceId = randomUUID();
      // const userId = user.id;
      //generation of a new pair of tokens
      const token = await this.jwtService.createJwt(user.id, deviceId);
      const payloadNew = await this.jwtService.verifyRefreshToken(token.refreshToken);
      //preparation data for save device
      const dateCreatedToken = new Date(payloadNew.iat * 1000).toISOString();
      const dateExpiredToken = new Date(payloadNew.exp * 1000).toISOString();
      const newDevice = Device.createDevice(
        user.id,
        ipAddress,
        deviceName,
        dateCreatedToken,
        dateExpiredToken,
        deviceId,
        user,
      );
      //save
      await this.deviceRepo.saveDevice(newDevice);
      return token;
    }
    throw new UnauthorizedExceptionMY(`Incorrect password --sa-`);
  }
}
