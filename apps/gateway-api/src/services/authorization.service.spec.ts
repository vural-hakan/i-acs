import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import '../config/configuration';

import { authorizationServiceClient } from '../common';

import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  const rabbitmqMock = {
    send: jest.fn(),
  };

  beforeAll(async () => {
    const client = authorizationServiceClient;

    const serviceTestModule: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: 'authorization_client',
          useValue: client,
        },
        AuthorizationService,
      ],
    })
      .overrideProvider(client)
      .useValue(rabbitmqMock)
      .compile();

    service = serviceTestModule.get<AuthorizationService>(AuthorizationService);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllowedCards: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: ['ABC1234'],
      });
    });

    expect(service.getAllowedCards(1)).toBeDefined();
  });
  it('getAllowedDevices: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: ['1'],
      });
    });

    expect(service.getAllowedDevices('ABC1234')).toBeDefined();
  });
  it('createUser: success', async () => {
    rabbitmqMock.send.mockImplementationOnce(() => {
      return Promise.resolve({
        statusCode: HttpStatus.OK,
        message: 'SUCCESS',
        data: true,
      });
    });

    expect(service.addDevicePermission(1, 'ABC1234')).toBeDefined();
  });
});
