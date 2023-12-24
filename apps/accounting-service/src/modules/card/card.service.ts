import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CardEntity } from './entities';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(CardEntity)
    private repository: Repository<CardEntity>,
  ) {}

  async listCards(page?: number, limit?: number): Promise<CardEntity[]> {
    const take = limit ? limit : 15;
    const skip = page && page > 1 ? (page - 1) * take : 0;
    const data = await this.repository.find({
      order: { id: 'ASC' },
      skip: skip,
      take: take,
    });
    return data;
  }

  async getCard(number: string): Promise<CardEntity> {
    const data = await this.repository.findOne({
      where: { number },
    });
    return data;
  }

  async createCard(number: string): Promise<CardEntity> {
    const result = await this.repository.upsert(
      this.repository.create({ number }),
      ['number'],
    );

    return result.generatedMaps[0] as CardEntity;
  }

  async assignCard(number: string, userId: number): Promise<boolean> {
    const result = await this.repository.update(
      { number },
      { userId, updatedAt: new Date().getTime() },
    );

    return result.affected > 0;
  }

  async getUserCards(userId: number): Promise<CardEntity[]> {
    const data = await this.repository.find({
      where: { userId },
      order: { id: 'ASC' },
    });
    return data;
  }
}
