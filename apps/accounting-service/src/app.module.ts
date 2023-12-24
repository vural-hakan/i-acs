import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardModule, DeviceModule, UserModule } from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
    }),
    UserModule,
    DeviceModule,
    CardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
