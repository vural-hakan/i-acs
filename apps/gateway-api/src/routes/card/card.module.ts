import { Module } from '@nestjs/common';

import {
  accountingServiceClient,
  authorizationServiceClient,
} from '../../common';
import { AccountingService, AuthorizationService } from '../../services';

import { CardController } from './card.controller';

@Module({
  imports: [],
  controllers: [CardController],
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
export class CardModule {}
