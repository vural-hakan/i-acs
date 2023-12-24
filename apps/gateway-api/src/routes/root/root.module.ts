import { Module } from '@nestjs/common';

import { accountingServiceClient, AuthModule } from '../../common';
import { AccountingService } from '../../services';

import { RootController } from './root.controller';

@Module({
  imports: [AuthModule],
  controllers: [RootController],
  providers: [
    {
      provide: 'accounting_client',
      useValue: accountingServiceClient,
    },
    AccountingService,
  ],
  exports: [],
})
export class RootModule {}
