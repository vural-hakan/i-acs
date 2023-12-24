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

import { CardController, CardModule } from './';

describe('CardController', () => {
  let controller: CardController;
  const accountingServiceMock = {
    listCards: jest.fn(),
    createCard: jest.fn(),
    assignToUser: jest.fn(),
    getUserCards: jest.fn(),
    checkCardIsExist: jest.fn(),
    checkDeviceIsExist: jest.fn(),
  };
  const authorizationServiceMock = {
    getAllowedDevices: jest.fn(),
    addDevicePermission: jest.fn(),
  };

  beforeAll(async () => {
    const controllerTestModule: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CardController],
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

    controller = controllerTestModule.get<CardController>(CardController);
  });

  it('Module should be defined', () => {
    expect(CardModule).toBeDefined();
  });

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listCards()', () => {
    it('listCards: success', async () => {
      accountingServiceMock.listCards.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: [
            {
              id: 1,
              name: 'Default Card',
              cardname: 'default.card',
            },
          ],
        });
      });
      await controller.listCards({ page: '0', limit: '15' }).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('createCard()', () => {
    it('createCard: success', async () => {
      accountingServiceMock.createCard.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: { id: 1 },
        });
      });
      const req = createRequest({
        body: { name: 'test', cardname: 'test', password: 'test' },
      });
      await controller.createCard(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('assignToUser()', () => {
    it('assignToUser: success', async () => {
      accountingServiceMock.assignToUser.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: {
            id: 1,
            name: 'ABC1234',
            updatedAt: '2023-12-23T10:59:35.290Z',
            result: true,
          },
        });
      });
      const req = createRequest({
        body: { number: 'ABC1234', userId: 1 },
      });
      await controller.assignToUser(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('getUserCards()', () => {
    it('getUserCards: success', async () => {
      accountingServiceMock.getUserCards.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: ['ABC1234'],
        });
      });
      const req = createRequest({
        body: { userId: 1 },
      });
      await controller.getUserCards(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('getAllowedDevices()', () => {
    it('getAllowedDevices: success', async () => {
      accountingServiceMock.checkCardIsExist.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: true,
        });
      });
      authorizationServiceMock.getAllowedDevices.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: ['1', '2'],
        });
      });
      const req = createRequest({
        body: { cardNumber: 'ABC12345' },
      });
      await controller.getAllowedDevices(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('addDevicePermission()', () => {
    it('addDevicePermission: success', async () => {
      accountingServiceMock.checkDeviceIsExist.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: true,
        });
      });
      accountingServiceMock.checkCardIsExist.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: true,
        });
      });
      authorizationServiceMock.addDevicePermission.mockImplementationOnce(
        () => {
          return of({
            statusCode: HttpStatus.OK,
            message: 'SUCCESS',
            data: true,
          });
        },
      );
      const req = createRequest({
        body: { deviceId: 1, cardNumber: 'ABC12345' },
      });
      await controller.addDevicePermission(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });
});
