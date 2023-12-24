import {
  BadRequestException,
  Controller,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { validateOrReject } from 'class-validator';

import { IResponse } from '../../common';

import { DeviceService } from './device.service';
import { DeviceDto } from './dto';

@Controller()
export class DeviceController {
  constructor(private readonly deviceServices: DeviceService) {}

  @MessagePattern('listDevices')
  async listDevices(@Payload() message: unknown): Promise<IResponse> {
    const payload = new DeviceDto(message);
    await validateOrReject('DeviceDto', payload, {
      groups: ['listDevices'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const list = await this.deviceServices.listDevices(
      payload.page,
      payload.limit,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: list,
    };
  }

  @MessagePattern('createDevice')
  async createDevice(@Payload() message: unknown): Promise<IResponse> {
    const payload = new DeviceDto(message);
    await validateOrReject('DeviceDto', payload, {
      groups: ['createDevice'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const device = await this.deviceServices.createDevice(payload.name);

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: {
        id: device.id,
      },
    };
  }

  @MessagePattern('updateDevice')
  async updateDevice(@Payload() message: unknown): Promise<IResponse> {
    const payload = new DeviceDto(message);
    await validateOrReject('DeviceDto', payload, {
      groups: ['updateDevice'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const device = await this.deviceServices.getDevice(payload.id);
    if (!device) {
      throw new UnprocessableEntityException('Device not found');
    }
    const result = await this.deviceServices.updateDevice(device, {
      name: payload.name,
    });
    if (!result) {
      throw new UnprocessableEntityException('Device cannot updated');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: {
        id: device.id,
        name: device.name,
        updatedAt: new Date(device.updatedAt),
        result: result,
      },
    };
  }

  @MessagePattern('checkDeviceIsExist')
  async checkDeviceIsExist(@Payload() message: unknown): Promise<IResponse> {
    const payload = new DeviceDto(message);
    await validateOrReject('DeviceDto', payload, {
      groups: ['checkDeviceIsExist'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const device = await this.deviceServices.getDevice(payload.id);

    if (!device) {
      throw new UnprocessableEntityException('Device not found');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: true,
    };
  }
}
