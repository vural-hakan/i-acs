import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AccessListController } from './access-list.controller';
import { AccessListService } from './access-list.service';
describe('AccessListController', () => {
  let controller: AccessListController;
  const redisMock = {
    sadd: jest.fn(),
    smembers: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessListController],
      providers: [
        AccessListService,
        {
          provide: 'client',
          useValue: redisMock,
        },
      ],
    }).compile();

    controller = module.get<AccessListController>(AccessListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addDevicePermission()', () => {
    it('dto validation exception', async () => {
      await controller.addDevicePermission({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('success', async () => {
      redisMock.sadd.mockImplementationOnce(() => {
        return true;
      });

      redisMock.sadd.mockImplementationOnce(() => {
        return true;
      });

      await controller
        .addDevicePermission({ deviceId: 1, cardNumber: 'ABC1234' })
        .then((resp) => {
          expect(resp.statusCode).toBe(HttpStatus.OK);
        });
    });
  });

  describe('getAllowedCards()', () => {
    it('dto validation exception', async () => {
      await controller.getAllowedCards({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('success', async () => {
      redisMock.smembers.mockImplementationOnce(() => {
        return ['ABC1234'];
      });

      await controller.getAllowedCards({ deviceId: 1 }).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('getAllowedDevices()', () => {
    it('dto validation exception', async () => {
      await controller.getAllowedDevices({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('success', async () => {
      redisMock.smembers.mockImplementationOnce(() => {
        return ['1'];
      });

      await controller
        .getAllowedDevices({ cardNumber: 'ABC1234' })
        .then((resp) => {
          expect(resp.statusCode).toBe(HttpStatus.OK);
        });
    });
  });
});
