import {
  BadRequestException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserEntity, UserService } from '../user';

import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CardEntity } from './entities';

describe('CardController', () => {
  let controller: CardController;
  const cardMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };
  const userMock = {
    findOne: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        CardService,
        {
          provide: getRepositoryToken(CardEntity),
          useValue: cardMock,
        },
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userMock,
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listCards()', () => {
    it('dto validation exception', async () => {
      await controller
        .listCards({
          limit: 'asd',
          page: 0,
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
        });
    });

    it('valid request', async () => {
      cardMock.find.mockImplementationOnce(() => {
        return [{ number: 'test' }];
      });
      const res = await controller.listCards({
        limit: 0,
        page: 0,
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });

    it('valid request with pagination', async () => {
      cardMock.find.mockImplementationOnce(() => {
        return [{ number: 'test' }];
      });
      const res = await controller.listCards({
        limit: 5,
        page: 2,
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('createCard()', () => {
    it('dto validation exception', async () => {
      await controller.createCard({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('card number exist exception', async () => {
      cardMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          number: 'test',
        } as CardEntity;
      });
      await controller
        .createCard({
          number: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('Card number already exist');
        });
    });

    it('valid request', async () => {
      cardMock.create.mockImplementationOnce(() => {
        return {
          number: 'test',
        } as CardEntity;
      });
      cardMock.upsert.mockImplementationOnce(() => {
        return {
          generatedMaps: [
            {
              number: 'test',
            } as CardEntity,
          ],
        };
      });
      const res = await controller.createCard({
        number: 'test',
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('assignToUser()', () => {
    it('dto validation exception', async () => {
      await controller.assignToUser({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('card not found exception', async () => {
      cardMock.findOne.mockImplementationOnce(() => {
        return null;
      });
      await controller
        .assignToUser({
          number: 'test',
          userId: 1,
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('Card not found');
        });
    });

    it('user not found exception', async () => {
      cardMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          number: 'test',
        } as CardEntity;
      });
      userMock.findOne.mockImplementationOnce(() => {
        return null;
      });
      await controller
        .assignToUser({
          userId: 1,
          number: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('User not found');
        });
    });

    it('valid request', async () => {
      cardMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          number: 'test',
        } as CardEntity;
      });
      userMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
        } as UserEntity;
      });
      cardMock.update.mockImplementationOnce(() => {
        return {
          affected: 1,
        };
      });
      const res = await controller.assignToUser({
        userId: 1,
        number: 'test',
      });

      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('getUserCards()', () => {
    it('dto validation exception', async () => {
      await controller.getUserCards({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('user not found exception', async () => {
      userMock.findOne.mockImplementationOnce(() => {
        return null;
      });
      await controller
        .getUserCards({
          userId: 1,
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('User not found');
        });
    });

    it('valid request', async () => {
      userMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
        } as UserEntity;
      });

      cardMock.find.mockImplementationOnce(() => {
        return [{ number: 'test' }];
      });

      const res = await controller.getUserCards({
        userId: 1,
      });

      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('checkCardIsExist()', () => {
    it('dto validation exception', async () => {
      await controller.checkCardIsExist({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('card not found exception', async () => {
      cardMock.findOne.mockImplementationOnce(() => {
        return null;
      });
      await controller
        .checkCardIsExist({
          number: 'ABC1234',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('Card not found');
        });
    });

    it('valid request', async () => {
      cardMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          number: 'test',
        } as CardEntity;
      });

      const res = await controller.checkCardIsExist({
        number: 'ABC1234',
      });

      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });
});
