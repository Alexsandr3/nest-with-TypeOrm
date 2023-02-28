import { BadRequestException, Body, Controller, Get, HttpCode, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
import { TelegramUpdateMessage } from './types/telegram-update-message-type';
import { CommandBus } from '@nestjs/cqrs';
import { TelegramUpdateMessageCommand } from './application/use-cases/telegram-update-message.command';
import { IntegrationsService } from './integrations.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { Request } from 'express';
import { JwtAuthGuard } from '../../guards/jwt-auth-bearer.guard';
import { CurrentUserIdBlogger } from '../../decorators/current-user-id.param.decorator';

@ApiTags('integrations')
@Controller('integrations')
export class IntegrationsController {
  stripe = new Stripe(
    'sk_test_51MdBGZIW91ghbnFjoGAc7DP0sJnmihtphsGAdzSkGYpfhKjmW0f6CgUaaApBdqJ8tSquMYLQ5vT6x0f0ALigwODq006TeMF5mg',
    {
      apiVersion: '2022-11-15',
    },
  );

  constructor(private commandBus: CommandBus, private readonly integrationsService: IntegrationsService) {}

  @ApiOperation({
    summary: 'Webhook for TelegramBot Api (see telegram bot official documentation)',
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('telegram/webhook')
  async telegramHook(@Body() payload: TelegramUpdateMessage) {
    console.log('payload------------', payload);
    await this.commandBus.execute(new TelegramUpdateMessageCommand(payload));
    return { here: 'here' };
  }

  @ApiOperation({ summary: 'Get auth bot link with personal user code inside' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('telegram/auth-bot-link')
  getLinkTelegramBot(@CurrentUserIdBlogger() userId: string) {
    return { link: 'success' };
  }

  @ApiOperation({
    summary: 'Webhook for Stripe Api (see stripeofficial documentation)',
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('telegram/stripe')
  async stripeHook(@Req() request: RawBodyRequest<Request>) {
    const signature = request.headers['stripe-signature'];
    const secret = 'whsec_4IYThE5RZiosJTeCPJ6J6d82S9dB2r8j';
    try {
      const event = this.stripe.webhooks.constructEvent(request.rawBody, signature, secret);
      console.log(event);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('-----session', session);
        // this.finishPaymentUseCase.excute(session.client_reference_id , event)
      }
    } catch (e) {
      throw new BadRequestException(`Webhook error: ${e.message}`);
    }
  }

  @Get(`notification`)
  sendMessage(@Body() inputModel: any) {
    return this.integrationsService.sendMessage();
  }
}
