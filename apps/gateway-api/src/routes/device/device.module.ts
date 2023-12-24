import { Module } from '@nestjs/common';

import {
  accountingServiceClient,
  authorizationServiceClient,
} from '../../common';
import { AccountingService, AuthorizationService } from '../../services';

import { DeviceController } from './device.controller';

@Module({
  imports: [],
  controllers: [DeviceController],
  providers: [
    {
      provide: 'accounting_client',
      useValue: accountingServiceClient,
    },
    AccountingService,
    {
      provide: 'authorization_client',
      useValue: authorizationServiceClient,
    },
    AuthorizationService,
  ],
  exports: [AccountingService],
})
export class DeviceModule {}
