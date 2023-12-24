import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({
    path: process.cwd() + '/.env',
  });
}

export {};
