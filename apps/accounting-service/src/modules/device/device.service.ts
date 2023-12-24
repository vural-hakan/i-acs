import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeviceEntity } from './entities';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private repository: Repository<DeviceEntity>,
  ) {}

  async listDevices(page?: number, limit?: number): Promise<DeviceEntity[]> {
    const take = limit ? limit : 15;
    const skip = page && page > 1 ? (page - 1) * take : 0;
    const data = await this.repository.find({
      order: { id: 'ASC' },
      skip: skip,
      take: take,
    });
    return data;
  }

  async getDevice(id: number): Promise<DeviceEntity> {
    const data = await this.repository.findOne({
      where: { id },
    });
    return data;
  }

  async createDevice(name: string): Promise<DeviceEntity> {
    const result = await this.repository.upsert(
      this.repository.create({ name }),
      ['id'],
    );

    return result.generatedMaps[0] as DeviceEntity;
  }

  async updateDevice(
    device: DeviceEntity,
    params: {
      name: string;
    },
  ): Promise<boolean> {
    const response = await this.repository.update(
      { id: device.id },
      {
        ...params,
        updatedAt: new Date().getTime(),
      },
    );

    return response.affected > 0;
  }
}
