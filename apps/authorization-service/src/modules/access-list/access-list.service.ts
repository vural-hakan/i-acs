import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AccessListService {
  client: Redis;
  constructor(@Inject('client') client: Redis) {
    this.client = client;
  }

  async addAllowedCard(deviceId: number, cardNumber: string): Promise<boolean> {
    const response = await this.client.sadd(
      'device:acl:' + deviceId.toString(),
      cardNumber,
    );

    return response > 1;
  }

  async addAllowedDevice(
    cardNumber: string,
    deviceId: number,
  ): Promise<boolean> {
    const response = await this.client.sadd(
      'card:acl:' + cardNumber,
      deviceId.toString(),
    );

    return response > 1;
  }

  async getAllowedCards(deviceId: number): Promise<string[]> {
    const response = await this.client.smembers(
      'device:acl:' + deviceId.toString(),
    );

    return response;
  }
  async getAllowedDevices(cardNumber: string): Promise<string[]> {
    const response = await this.client.smembers('card:acl:' + cardNumber);

    return response;
  }
}
