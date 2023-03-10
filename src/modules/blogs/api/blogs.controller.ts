import { Controller, Param, UseGuards, Post, Delete, HttpCode } from '@nestjs/common';
import { ValidateUuidPipe } from '../../../validators/id-validation-pipe';
import { CurrentUserIdBlogger } from '../../../decorators/current-user-id.param.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../guards/jwt-auth-bearer.guard';
import { SubscriptionToBlogCommand } from '../application/use-cases/subscription-to-blog.handler';
import { UnsubscriptionToBlogCommand } from '../application/use-cases/unsubscription-to-blog.handler';

@ApiTags('Blogs')
@SkipThrottle()
@Controller(`blogs`)
export class BlogsController {
  constructor(private commandBus: CommandBus) {}

  // @ApiTags('Subscription')
  @ApiOperation({ summary: 'Subscribe user to blog. Notifications about new posts will be send to Telegram Bot' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Post(`:blogId/subscription`)
  async subscription(@CurrentUserIdBlogger() userId: string, @Param(`blogId`, ValidateUuidPipe) blogId: string) {
    return await this.commandBus.execute(new SubscriptionToBlogCommand(blogId, userId));
  }

  // @ApiTags('Subscription')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unsubscribe user from blog. Notifications about new posts will not be send to Telegram Bot' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found blog' })
  @ApiBasicAuth()
  @HttpCode(204)
  @Delete(`:blogId/subscription`)
  async unSubscription(@CurrentUserIdBlogger() userId: string, @Param(`blogId`, ValidateUuidPipe) blogId: string) {
    return await this.commandBus.execute(new UnsubscriptionToBlogCommand(blogId, userId));
  }
}
