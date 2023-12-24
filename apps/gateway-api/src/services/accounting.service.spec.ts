import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import '../config/configuration';

import { accountingServiceClient } from '../common';

import { AccountingService } from './accounting.service';

describe('AccountingService', () => {
  let service: AccountingService;
  const rabbitmqMock = {
    send: jest.fn(),
  };

  beforeAll(async () => {
    const client = accountingServiceClient;

    const serviceTestModule: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: 'accounting_client',
          useValue: client,
        },
        AccountingService,
      ],
    })
      .overrideProvider(client)
      .useValue(rabbitmqMock)
      .compile();

    service = serviceTestModule.get<AccountingService>(AccountingService);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('auth: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: {
          id: 1,
          name: 'Default User',
          username: 'default.user',
          updatedAt: '2023-12-22T14:46:02.960Z',
          result: true,
        },
      });
    });

    expect(service.auth('default.user', '123456')).toBeDefined();
  });
  it('listUsers: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: [],
      });
    });

    expect(service.listUsers()).toBeDefined();
  });
  it('createUser: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: {
          id: 1,
        },
      });
    });

    expect(
      service.createUser('default user', 'default.user', '123456'),
    ).toBeDefined();
  });
  it('updateUser: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: {
          id: 1,
        },
      });
    });

    expect(service.updateUser(1, 'updated name')).toBeDefined();
  });

  it('listDevices: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: [],
      });
    });

    expect(service.listDevices()).toBeDefined();
  });
  it('createDevice: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: {
          id: 1,
        },
      });
    });

    expect(service.createDevice('default device')).toBeDefined();
  });
  it('updateDevice: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: {
          id: 1,
        },
      });
    });

    expect(service.updateDevice(1, 'updated device')).toBeDefined();
  });

  it('listCards: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: [],
      });
    });

    expect(service.listCards()).toBeDefined();
  });
  it('createCard: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: {
          id: 1,
        },
      });
    });

    expect(service.createCard('ABC1234')).toBeDefined();
  });
  it('assignToUser: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: {
          id: 1,
        },
      });
    });

    expect(service.assignToUser('ABC1234', 1)).toBeDefined();
  });

  it('getUserCards: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: [],
      });
    });

    expect(service.getUserCards(1)).toBeDefined();
  });

  it('getUserCards: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: [],
      });
    });

    expect(service.getUserCards(1)).toBeDefined();
  });

  it('checkCardIsExist: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: true,
      });
    });

    expect(service.checkCardIsExist('ABC1234')).toBeDefined();
  });

  it('checkDeviceIsExist: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: true,
      });
    });

    expect(service.checkDeviceIsExist(1)).toBeDefined();
  });
});
