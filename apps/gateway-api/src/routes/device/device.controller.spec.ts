import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { of } from 'rxjs';

import '../../config/configuration';

import {
  accountingServiceClient,
  authorizationServiceClient,
} from '../../common';
import { AccountingService, AuthorizationService } from '../../services';

import { DeviceController, DeviceModule } from './';

describe('DeviceController', () => {
  let controller: DeviceController;
  const accountingServiceMock = {
    listDevices: jest.fn(),
    createDevice: jest.fn(),
    updateDevice: jest.fn(),
    checkDeviceIsExist: jest.fn(),
  };

  const authorizationServiceMock = {
    getAllowedCards: jest.fn(),
  };

  beforeAll(async () => {
    const controllerTestModule: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [DeviceController],
      providers: [
        {
          provide: 'accounting_client',
          useValue: accountingServiceClient,
        },
        {
          provide: AccountingService,
          useValue: accountingServiceMock,
        },
        {
          provide: 'authorization_client',
          useValue: authorizationServiceClient,
        },
        {
          provide: AuthorizationService,
          useValue: authorizationServiceMock,
        },
      ],
    }).compile();

    controller = controllerTestModule.get<DeviceController>(DeviceController);
  });

  it('Module should be defined', () => {
    expect(DeviceModule).toBeDefined();
  });

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listDevices()', () => {
    it('listDevices: success', async () => {
      accountingServiceMock.listDevices.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: [
            {
              id: 1,
              name: 'Default Device',
              devicename: 'default.device',
            },
          ],
        });
      });
      await controller.listDevices({ page: '0', limit: '15' }).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('createDevice()', () => {
    it('createDevice: success', async () => {
      accountingServiceMock.createDevice.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: { id: 1 },
        });
      });
      const req = createRequest({
        body: { name: 'test', devicename: 'test', password: 'test' },
      });
      await controller.createDevice(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('updateDevice()', () => {
    it('updateDevice: success', async () => {
      accountingServiceMock.updateDevice.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: {
            id: 1,
            name: 'Updated device',
            devicename: 'default.device',
            updatedAt: '2023-12-23T10:07:02.609Z',
            result: true,
          },
        });
      });
      const req = createRequest({
        body: { id: 1, name: 'test' },
      });
      await controller.updateDevice(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('getAllowedCards()', () => {
    it('getAllowedCards: success', async () => {
      accountingServiceMock.checkDeviceIsExist.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: true,
        });
      });
      authorizationServiceMock.getAllowedCards.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: ['ABC1234'],
        });
      });
      const req = createRequest({
        body: { deviceId: 1 },
      });
      await controller.getAllowedCards(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });
});
