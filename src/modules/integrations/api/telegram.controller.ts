import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { TelegramUpdateMessage } from '../types/telegram-update-message-type';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../main/guards/jwt-auth-bearer.guard';
import { CurrentUserIdBlogger } from '../../../main/decorators/current-user-id.param.decorator';
import { TelegramUpdateMessageCommand } from '../application/use-cases/telegram-update-message.handler';
import { AuthBotLinkCommand } from '../application/use-cases/auth-bot-link.handler';

@ApiTags('integrations')
@Controller('integrations')
export class TelegramController {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({
    summary: 'Webhook for TelegramBot Api (see telegram bot official documentation)',
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('telegram/webhook')
  async telegramHook(@Body() payload: TelegramUpdateMessage) {
    await this.commandBus.execute(new TelegramUpdateMessageCommand(payload));
    return;
  }

  @ApiOperation({ summary: 'Get auth bot link with personal user code inside' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('telegram/auth-bot-link')
  getLinkTelegramBot(@CurrentUserIdBlogger() userId: string) {
    return this.commandBus.execute(new AuthBotLinkCommand(userId));
  }

  // @Get(`notification`)
  // sendMessage(@Body() inputModel: any) {
  //   return this.integrationsService.sendMessage();
  // }
}
