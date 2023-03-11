import { Injectable } from '@nestjs/common';
import { BlogsRepositories } from '../../blogs/infrastructure/blogs.repositories';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../../config/configuration';
import * as https from 'https';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TelegramEvent {
  private token = this.configService.get('integrations', { infer: true });
  constructor(
    private readonly blogsRepo: BlogsRepositories,
    private configService: ConfigService<ConfigType>,
  ) {}

  @OnEvent('createdNewPost')
  private async notification(blogId: string) {
    const subscriptionToBlog = await this.blogsRepo.findSubscriptionForNotification(
      blogId,
    );
    if (!subscriptionToBlog) return;
    for (const s of subscriptionToBlog) {
      const url = `https://api.telegram.org/bot${this.token.TOKEN_TELEGRAM}/sendMessage?chat_id=${s.telegramId}&text=newPost%20Created http://www.localhost:5004/blogs/${blogId}`;
      await https.get(url);
    }
  }

  // sendMessage() {
  //   return { send: 'message---------------000000' };
  // }
}
