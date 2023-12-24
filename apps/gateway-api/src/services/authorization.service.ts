import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { BaseService } from './base.service';

@Injectable()
export class AuthorizationService extends BaseService {
  constructor(@Inject('authorization_client') client: ClientRMQ) {
    super(client, 'authorization');
  }

  getAllowedCards(deviceId: number) {
    return this.client.send('getAllowedCards', { deviceId });
  }

  getAllowedDevices(cardNumber: string) {
    return this.client.send('getAllowedDevices', { cardNumber });
  }

  addDevicePermission(deviceId: number, cardNumber: string) {
    return this.client.send('addDevicePermission', { deviceId, cardNumber });
  }
}
