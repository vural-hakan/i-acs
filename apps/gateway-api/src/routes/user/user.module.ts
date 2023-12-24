import { Module } from '@nestjs/common';

import { accountingServiceClient } from '../../common';
import { AccountingService } from '../../services';

import { UserController } from './user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: 'accounting_client',
      useValue: accountingServiceClient,
    },
    AccountingService,
  ],
  exports: [AccountingService],
})
export class UserModule {}
