import { Module } from '@nestjs/common';
import { StripeController } from './api/stripe.controller';
import { TelegramUpdateMessageHandler } from './application/use-cases/telegram-update-message.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionToBlog } from '../../entities/subscription.entity';
import { BlogsRepositories } from '../blogs/infrastructure/blogs.repositories';
import { Blog } from '../../entities/blog.entity';
import { BannedBlogUser } from '../../entities/banned-blog-user.entity';
import { ImageBlog } from '../../entities/imageBlog.entity';
import { JwtAuthGuard } from '../../main/guards/jwt-auth-bearer.guard';
import { JwtService } from '../auth/application/jwt.service';
import { TelegramController } from './api/telegram.controller';
import { AuthBotLinkHandler } from './application/use-cases/auth-bot-link.handler';
import { User } from '../../entities/user.entity';
import { UsersRepositories } from '../sa-users/infrastructure/users-repositories';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '../../main/config/configuration';
import { StripeService } from './application/stripe.service';
import { TelegramEvent } from './application/telegram.event';
import { TelegramAdapter } from './adapters/telegram.adapter';

const adapters = [TelegramAdapter, BlogsRepositories, UsersRepositories, JwtService];
const handlers = [
  //---> integrations
  TelegramUpdateMessageHandler,
  AuthBotLinkHandler,
];

const guards = [JwtAuthGuard];

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionToBlog, Blog, BannedBlogUser, ImageBlog, User]),
    ConfigModule.forRoot({ isGlobal: true, load: [getConfiguration] }),
    CqrsModule,
  ],
  controllers: [StripeController, TelegramController],
  providers: [...adapters, ...handlers, ...guards, TelegramEvent, StripeService],
})
export class IntegrationsModule {}
