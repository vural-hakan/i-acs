import { BadRequestException, Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { validateOrReject } from 'class-validator';

import { IResponse } from '../../common';

import { AccessListService } from './access-list.service';
import { AccessListDTO } from './dto';

@Controller()
export class AccessListController {
  constructor(private readonly accessListServices: AccessListService) {}

  @MessagePattern('addDevicePermission')
  async addDevicePermission(@Payload() message: unknown): Promise<IResponse> {
    const payload = new AccessListDTO(message);
    await validateOrReject('addDevicePermission', payload, {
      groups: ['addDevicePermission'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    await this.accessListServices.addAllowedCard(
      payload.deviceId,
      payload.cardNumber,
    );
    await this.accessListServices.addAllowedDevice(
      payload.cardNumber,
      payload.deviceId,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: true,
    };
  }

  @MessagePattern('getAllowedCards')
  async getAllowedCards(@Payload() message: unknown): Promise<IResponse> {
    const payload = new AccessListDTO(message);
    await validateOrReject('AccessListDto', payload, {
      groups: ['getAllowedCards'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const list = await this.accessListServices.getAllowedCards(
      payload.deviceId,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: list,
    };
  }

  @MessagePattern('getAllowedDevices')
  async getAllowedDevices(@Payload() message: unknown): Promise<IResponse> {
    const payload = new AccessListDTO(message);
    await validateOrReject('AccessListDto', payload, {
      groups: ['getAllowedDevices'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const list = await this.accessListServices.getAllowedDevices(
      payload.cardNumber,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: list,
    };
  }
}
