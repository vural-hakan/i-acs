import { Routes } from '@nestjs/core';

import { CardModule, DeviceModule, RootModule, UserModule } from './routes';

export const AppRoutes: Routes = [
  {
    path: '',
    module: RootModule,
  },
  {
    path: 'user',
    module: UserModule,
  },
  {
    path: 'device',
    module: DeviceModule,
  },
  {
    path: 'card',
    module: CardModule,
  },
];
