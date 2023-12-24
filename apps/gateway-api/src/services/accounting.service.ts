import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

import { BaseService } from './base.service';

@Injectable()
export class AccountingService extends BaseService {
  constructor(@Inject('accounting_client') client: ClientRMQ) {
    super(client, 'accounting');
  }

  auth(username: string, password: string) {
    return this.client.send('auth', { username, password });
  }

  listUsers(limit?: number, page?: number) {
    return this.client.send('listUsers', { limit, page });
  }

  createUser(name: string, username: string, password: string) {
    return this.client.send('createUser', { name, username, password });
  }

  updateUser(id: number, name: string) {
    return this.client.send('updateUser', { id, name });
  }

  listDevices(limit?: number, page?: number) {
    return this.client.send('listDevices', { limit, page });
  }

  createDevice(name: string) {
    return this.client.send('createDevice', { name });
  }

  updateDevice(id: number, name: string) {
    return this.client.send('updateDevice', { id, name });
  }

  listCards(limit?: number, page?: number) {
    return this.client.send('listCards', { limit, page });
  }

  createCard(number: string) {
    return this.client.send('createCard', { number });
  }

  assignToUser(number: string, userId: number) {
    return this.client.send('assignToUser', { number, userId });
  }

  getUserCards(userId: number) {
    return this.client.send('getUserCards', { userId });
  }

  checkCardIsExist(number: string) {
    return this.client.send('checkCardIsExist', { number });
  }

  checkDeviceIsExist(id: number) {
    return this.client.send('checkDeviceIsExist', { id });
  }
}
