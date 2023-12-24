import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import { AccessListController } from './access-list.controller';
import { AccessListService } from './access-list.service';
@Module({
  imports: [],
  controllers: [AccessListController],
  providers: [
    AccessListService,
    {
      provide: 'client',
      useValue: new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_ACL_DB),
        enableOfflineQueue: false,
      }),
    },
  ],
  exports: [],
})
export class AccessListModule {}
