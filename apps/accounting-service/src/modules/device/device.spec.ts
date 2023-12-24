import {
  BadRequestException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { DeviceEntity } from './entities';

describe('DeviceController', () => {
  let controller: DeviceController;
  const deviceMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        DeviceService,
        {
          provide: getRepositoryToken(DeviceEntity),
          useValue: deviceMock,
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listDevices()', () => {
    it('dto validation exception', async () => {
      await controller
        .listDevices({
          limit: 'asd',
          page: 0,
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
        });
    });

    it('valid request', async () => {
      deviceMock.find.mockImplementationOnce(() => {
        return [
          {
            id: 1,
            name: 'test',
          },
        ];
      });
      const res = await controller.listDevices({
        limit: 0,
        page: 0,
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });

    it('valid request with pagination', async () => {
      deviceMock.find.mockImplementationOnce(() => {
        return [
          {
            id: 1,
            name: 'test',
          },
        ];
      });
      const res = await controller.listDevices({
        limit: 5,
        page: 2,
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('createDevice()', () => {
    it('dto validation exception', async () => {
      await controller.createDevice({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('valid request', async () => {
      deviceMock.create.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
        } as DeviceEntity;
      });
      deviceMock.upsert.mockImplementationOnce(() => {
        return {
          generatedMaps: [
            {
              id: 1,
              name: 'test',
            } as DeviceEntity,
          ],
        };
      });
      const res = await controller.createDevice({
        name: 'test',
        devicename: 'test',
        password: 'test',
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('updateDevice()', () => {
    it('dto validation exception', async () => {
      await controller
        .updateDevice({
          name: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
        });
    });

    it('device not found exception', async () => {
      deviceMock.findOne.mockImplementationOnce(() => {
        return null;
      });
      await controller
        .updateDevice({
          id: 1,
          name: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('Device not found');
        });
    });

    it('device cannot update exception', async () => {
      deviceMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
        } as DeviceEntity;
      });
      deviceMock.update.mockImplementationOnce(() => {
        return {
          affected: 0,
        };
      });
      await controller
        .updateDevice({
          id: 1,
          name: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('Device cannot updated');
        });
    });

    it('valid request', async () => {
      deviceMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
        } as DeviceEntity;
      });
      deviceMock.update.mockImplementationOnce(() => {
        return {
          affected: 1,
        };
      });
      const res = await controller.updateDevice({
        id: 1,
        name: 'test',
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('checkDeviceIsExist()', () => {
    it('dto validation exception', async () => {
      await controller.checkDeviceIsExist({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('device not found exception', async () => {
      deviceMock.findOne.mockImplementationOnce(() => {
        return null;
      });
      await controller
        .checkDeviceIsExist({
          id: 1,
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('Device not found');
        });
    });

    it('valid request', async () => {
      deviceMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
        } as DeviceEntity;
      });
      const res = await controller.checkDeviceIsExist({
        id: 1,
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });
});
