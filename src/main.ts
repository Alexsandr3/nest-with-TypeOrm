import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/configuration';
import { createdApp } from './helpers/createdApp';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { getSetupSwagger } from './swagger/getSetupSwagger';
import { TelegramAdapter } from './modules/integrations/adapters/telegram.adapter';
import process from 'process';
import * as ngrok from 'ngrok';

async function connectToNgrok(port: number) {
  return await ngrok.connect({ authtoken: process.env.TOKEN_NGROK, addr: port });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, rawBody: true, bufferLogs: true });
  const configService = app.get(ConfigService<ConfigType>);
  const port = configService.get('PORT', { infer: true });
  const finishedApp = createdApp(app);
  getSetupSwagger(finishedApp);
  await finishedApp.listen(port).then(async () => console.log(`Server is listening on ${await app.getUrl()}`));
  //for -----------------------------> telegram
  const development = configService.get('dev', { infer: true });
  let baseUrl = development.CURRENT_APP_BASE_URL;
  const telegramAdapter = await app.resolve(TelegramAdapter);
  if (development.NODE_ENV === 'development') {
    baseUrl = await connectToNgrok(port);
  }
  await telegramAdapter
    .setWebhook(baseUrl + '/integrations/telegram/webhook')
    .then(async () => console.log(`Server is listening port NGROK on__ ${baseUrl + '/integrations/telegram/webhook'}`))
    .then(async () => console.log(`Server is listening port NGROK on__ ${baseUrl + '/integrations/notification'}`));
  // for -----------------------------> swagger
  // get the swagger json file (if app is running in development mode)
  const dev = configService.get('dev', { infer: true });
  // get the swagger json file (if app is running in development mode)
  if (dev.NODE_ENV === 'development') {
    const serverUrl = `http://localhost:${port}`;
    // write swagger ui files
    get(`${serverUrl}/api/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      // console.log(`Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`);
    });

    get(`${serverUrl}/api/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      // console.log(`Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`);
    });

    get(`${serverUrl}/api/swagger-ui-standalone-preset.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-standalone-preset.js'));
      // console.log(`Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`);
    });

    get(`${serverUrl}/api/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      // console.log(`Swagger UI css file written to: '/swagger-static/swagger-ui.css'`);
    });
  }
}

bootstrap();
