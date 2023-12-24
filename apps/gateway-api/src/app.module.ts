import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { AppRoutes } from './app.routes';
import { CardModule, DeviceModule, RootModule, UserModule } from './routes';
@Module({
  imports: [
    RouterModule.register(AppRoutes),
    // Service Modules
    RootModule,
    UserModule,
    DeviceModule,
    CardModule,
  ],
})
export class AppModule {}
