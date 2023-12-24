import {
  BadRequestException,
  Controller,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { validateOrReject } from 'class-validator';

import { IResponse } from '../../common';
import { UserService } from '../user/user.service';

import { CardService } from './card.service';
import { CardDto } from './dto';

@Controller()
export class CardController {
  constructor(
    private readonly cardServices: CardService,
    private readonly userService: UserService,
  ) {}

  @MessagePattern('listCards')
  async listCards(@Payload() message: unknown): Promise<IResponse> {
    const payload = new CardDto(message);
    await validateOrReject('CardDto', payload, {
      groups: ['listCards'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const list = await this.cardServices.listCards(payload.page, payload.limit);

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: list,
    };
  }

  @MessagePattern('createCard')
  async createCard(@Payload() message: unknown): Promise<IResponse> {
    const payload = new CardDto(message);
    await validateOrReject('CardDto', payload, {
      groups: ['createCard'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const isExist = await this.cardServices.getCard(payload.number);
    if (isExist) {
      throw new UnprocessableEntityException('Card number already exist');
    }

    const card = await this.cardServices.createCard(payload.number);

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: {
        id: card.id,
      },
    };
  }

  @MessagePattern('assignToUser')
  async assignToUser(@Payload() message: unknown): Promise<IResponse> {
    const payload = new CardDto(message);
    await validateOrReject('CardDto', payload, {
      groups: ['assignToUser'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });
    const card = await this.cardServices.getCard(payload.number);
    if (!card) {
      throw new UnprocessableEntityException('Card not found');
    }

    const user = await this.userService.getUser(payload.userId);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    const result = await this.cardServices.assignCard(payload.number, user.id);

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: {
        id: card.id,
        name: card.number,
        updatedAt: new Date(),
        result: result,
      },
    };
  }

  @MessagePattern('getUserCards')
  async getUserCards(@Payload() message: unknown): Promise<IResponse> {
    const payload = new CardDto(message);
    await validateOrReject('CardDto', payload, {
      groups: ['getUserCards'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const user = await this.userService.getUser(payload.userId);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    const list = await this.cardServices.getUserCards(payload.userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: list,
    };
  }

  @MessagePattern('checkCardIsExist')
  async checkCardIsExist(@Payload() message: unknown): Promise<IResponse> {
    const payload = new CardDto(message);
    await validateOrReject('CardDto', payload, {
      groups: ['checkCardIsExist'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const card = await this.cardServices.getCard(payload.number);

    if (!card) {
      throw new UnprocessableEntityException('Card not found');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: true,
    };
  }
}
