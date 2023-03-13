import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const axios = require('axios');
import { ConfigType } from '../../../main/config/configuration';

@Injectable()
export class TelegramAdapter {
  private axiosInstance: any;

  constructor(private configService: ConfigService<ConfigType>) {
    const token = this.configService.get('integrations', { infer: true });
    this.axiosInstance = axios.create({
      baseURL: `https://api.telegram.org/bot${token.TOKEN_TELEGRAM}/`,
    });
  }

  async setWebhook(url: string) {
    await this.axiosInstance.post(`setWebhook`, { url: url });
  }
}

/*async sendMessage(text: string, recipientId: number) {
    await this.axiosInstance.post(`sendMessage`, {
      chat_id: recipientId,
      text: text,
    });
  }


  async sendMessage(text: string, recipientId: number) {
    // const text = 'http://www.localhost:5004/blogs/${blogId}';

    await this.axiosInstance.post(`sendMessage`, {
      chat_id: 5263550244,
      text: text,
    });
  }

  async sendLocation(latitude: number, longitude: number, recipientId: number) {
    await this.axiosInstance.post(`sendLocation`, {
      chat_id: 5263550244,
      latitude: 53.893009,
      longitude: 27.567444,
    });
  }

  async sendLocation(latitude: number, longitude: number, recipientId: number) {
    await this.axiosInstance.post(`sendLocation`, {
      chat_id: recipientId,
      latitude: 51.668,
      longitude: 32.6546,
    });
  }*/
