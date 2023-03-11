import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  HttpCode,
  UseGuards,
  Res,
  Ip,
} from '@nestjs/common';
import { CreateUserDto } from '../../sa-users/api/input-Dto/create-User.dto';
import { ConfirmationCodeDto } from './input-dtos/confirmation-code.dto';
import { LoginDto } from './input-dtos/login.dto';
import { EmailRecoveryDto } from './input-dtos/email-recovery.dto';
import { NewPasswordDto } from './input-dtos/new-password.dto';
import { PayloadType } from '../application/payloadType';
import { RefreshGuard } from '../../../guards/jwt-auth-refresh.guard';
import { Response } from 'express';
import { PayloadRefresh } from '../../../decorators/payload-refresh.param.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth-bearer.guard';
import { UsersQueryRepositories } from '../../sa-users/infrastructure/query-reposirory/users-query.reposit';
import { MeViewDto } from '../infrastructure/me-view.dto';
import { CurrentUserId } from '../../../decorators/current-user-id.param.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { CommandBus } from '@nestjs/cqrs';
import { TokensType } from '../application/tokensType.dto';
import { ApiErrorResultDto } from '../../../common/api-error-result.dto';
import { TokenTypeSwaggerDto } from '../../../swagger/token-type-swagger.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RecoveryCommand } from '../application/use-cases/handlers/recovery.handler';
import { NewPasswordCommand } from '../application/use-cases/handlers/new-password.handler';
import { LoginCommand } from '../application/use-cases/handlers/login.handler';
import { RefreshCommand } from '../application/use-cases/handlers/refresh.handler';
import { ConfirmByCodeCommand } from '../application/use-cases/handlers/confirmation-by-code.handler';
import { CreateUserCommand } from '../application/use-cases/handlers/create-user.handler';
import { ResendingCommand } from '../application/use-cases/handlers/resending.handler';
import { LogoutCommand } from '../application/use-cases/handlers/logout.handler';

@ApiTags('Auth')
@Controller(`auth`)
export class AuthController {
  constructor(
    private readonly usersQueryRepositories: UsersQueryRepositories,
    private commandBus: CommandBus,
  ) {}

  @ApiHeader({ name: 'password-recovery' })
  @ApiOperation({
    summary:
      'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
  })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'Incorrect input data by field' })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @HttpCode(204)
  @Post(`/password-recovery`)
  async recovery(@Body() emailInputModel: EmailRecoveryDto): Promise<boolean> {
    return await this.commandBus.execute(new RecoveryCommand(emailInputModel));
  }

  @ApiOperation({ summary: 'Confirm Password recovery' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'Incorrect input data by field' })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @HttpCode(204)
  @Post(`/new-password`)
  async newPassword(@Body() newPasswordInputModel: NewPasswordDto): Promise<boolean> {
    return await this.commandBus.execute(new NewPasswordCommand(newPasswordInputModel));
  }

  @ApiOperation({ summary: 'Try login user to the system' })
  @ApiResponse({ status: 200, description: 'success', type: TokenTypeSwaggerDto })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @HttpCode(200)
  @Post(`/login`)
  async login(
    @Request() req,
    @Ip() ip,
    @Body() loginInputModel: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Pick<TokensType, 'accessToken'>> {
    const deviceName = req.headers['user-agent'];
    const createdToken = await this.commandBus.execute(
      new LoginCommand(loginInputModel, ip, deviceName),
    );
    res.cookie('refreshToken', createdToken.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: createdToken.accessToken };
  }

  @ApiOperation({
    summary:
      'Generate new pair of access and refresh tokens (in cookie client must send correct refresh Token that will be revoked after refreshing) Device LastActiveDate should\n' +
      'be overrode by issued Date of new refresh token',
  })
  @ApiResponse({ status: 200, description: 'success', type: TokenTypeSwaggerDto })
  @ApiResponse({
    status: 401,
    description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @SkipThrottle()
  @HttpCode(200)
  @UseGuards(RefreshGuard)
  @Post(`refresh-token`)
  async refresh(
    @PayloadRefresh() payloadRefresh: PayloadType,
    @Res({ passthrough: true }) res,
  ): Promise<Pick<TokensType, 'accessToken'>> {
    const createdToken = await this.commandBus.execute(
      new RefreshCommand(payloadRefresh),
    );
    res.cookie('refreshToken', createdToken.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: createdToken.accessToken };
  }

  @ApiOperation({ summary: 'Confirm registration' })
  @ApiResponse({ status: 204, description: 'Email was verified. Account was activated' })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data',
    type: ApiErrorResultDto,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @HttpCode(204)
  @Post(`/registration-confirmation`)
  async confirmByCode(@Body() codeInputModel: ConfirmationCodeDto): Promise<boolean> {
    return await this.commandBus.execute(new ConfirmByCodeCommand(codeInputModel));
  }

  @ApiOperation({
    summary:
      'Registration in the system. Email with confirmation code will be send to passed email address',
  })
  @ApiResponse({
    status: 204,
    description:
      'An email with a verification code has been sent to the specified email address',
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data',
    type: ApiErrorResultDto,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @HttpCode(204)
  @Post(`/registration`)
  async registration(@Body() userInputModel: CreateUserDto): Promise<boolean> {
    await this.commandBus.execute(new CreateUserCommand(userInputModel));
    return;
  }

  @ApiOperation({ summary: 'Resend confirmation registration Email if user exists' })
  @ApiResponse({
    status: 204,
    description:
      'An email with a verification code has been sent to the specified email address',
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data',
    type: ApiErrorResultDto,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @HttpCode(204)
  @Post(`/registration-email-resending`)
  async resending(@Body() resendingInputModel: EmailRecoveryDto): Promise<boolean> {
    return await this.commandBus.execute(new ResendingCommand(resendingInputModel));
  }

  @ApiOperation({
    summary: 'In cookie client must send correct refresh Token that will be revoked',
  })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 401,
    description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @SkipThrottle()
  @UseGuards(RefreshGuard)
  @HttpCode(204)
  @Post(`/logout`)
  async logout(@PayloadRefresh() payloadRefresh: PayloadType): Promise<boolean> {
    return await this.commandBus.execute(new LogoutCommand(payloadRefresh));
  }

  @ApiOperation({ summary: 'Get information about current user' })
  @ApiResponse({ status: 200, description: 'success', type: MeViewDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @SkipThrottle()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(`me`)
  async getProfile(@CurrentUserId() userId: string): Promise<MeViewDto> {
    return await this.usersQueryRepositories.getUserById(userId);
  }
}
