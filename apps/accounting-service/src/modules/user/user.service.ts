import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async listUsers(page?: number, limit?: number): Promise<UserEntity[]> {
    const take = limit ? limit : 15;
    const skip = page && page > 1 ? (page - 1) * take : 0;
    const data = await this.repository.find({
      order: { id: 'ASC' },
      skip: skip,
      take: take,
      select: ['id', 'name', 'username', 'createdAt', 'updatedAt'],
    });
    return data;
  }

  async getUser(id: number): Promise<UserEntity> {
    const data = await this.repository.findOne({
      where: { id },
    });
    return data;
  }

  async checkUsername(username: string): Promise<UserEntity> {
    const data = await this.repository.findOne({
      where: { username },
    });
    return data;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const data = await this.repository.findOne({
      where: { username },
    });
    return data;
  }

  async createUser(
    name: string,
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const result = await this.repository.upsert(
      this.repository.create({ name, username, password }),
      ['username'],
    );

    return result.generatedMaps[0] as UserEntity;
  }

  async updateUser(
    user: UserEntity,
    params: {
      name: string;
    },
  ): Promise<boolean> {
    const response = await this.repository.update(
      { id: user.id },
      {
        ...params,
        updatedAt: new Date().getTime(),
      },
    );

    return response.affected > 0;
  }
}
