import { config } from 'dotenv';
config();
import * as process from 'process';
// import 'dotenv/config';

export const getConfiguration = () => ({
  PORT: parseInt(process.env.PORTT, 10) || 3010,
  dev: {
    NODE_ENV: process.env.NODE_ENV,
    CURRENT_APP_BASE_URL: process.env.CURRENT_APP_BASE_URL || 'https://localhost:5004',
  },
  tokens: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    EXPIRED_REFRESH: process.env.EXPIRED_REFRESH,
    EXPIRED_ACCESS: process.env.EXPIRED_ACCESS,
  },
  database: {
    MONGO_URL: process.env.MONGO_URL,
    PGSQL_URL: process.env.PGSQL_URL,
  },
  email: {
    CLIENT_URL: process.env.CLIENT_URL,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM,
  },
  aws: {
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    BUCKET: process.env.BUCKET,
    ENDPOINT: process.env.ENDPOINT,
  },
  integrations: {
    TOKEN_NGROK: process.env.TOKEN_NGROK,
    TOKEN_TELEGRAM: process.env.TOKEN_TELEGRAM,
    API_KEY_STRIPE: process.env.API_KEY_STRIPE,
    SECRET_HOOK_STRIPE: process.env.SECRET_HOOK_STRIPE,
  },
});

export type ConfigType = ReturnType<typeof getConfiguration>;
