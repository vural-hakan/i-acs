import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { of } from 'rxjs';

import '../../config/configuration';

import { accountingServiceClient } from '../../common';
import { AccountingService } from '../../services';

import { UserController, UserModule } from './';

describe('UserController', () => {
  let controller: UserController;
  const accountingServiceMock = {
    listUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeAll(async () => {
    const controllerTestModule: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        {
          provide: 'client',
          useValue: accountingServiceClient,
        },
        {
          provide: AccountingService,
          useValue: accountingServiceMock,
        },
      ],
    }).compile();

    controller = controllerTestModule.get<UserController>(UserController);
  });

  it('Module should be defined', () => {
    expect(UserModule).toBeDefined();
  });

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listUsers()', () => {
    it('listUsers: success', async () => {
      accountingServiceMock.listUsers.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: [
            {
              id: 1,
              name: 'Default User',
              username: 'default.user',
            },
          ],
        });
      });
      await controller.listUsers({ page: '0', limit: '15' }).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('createUser()', () => {
    it('createUser: success', async () => {
      accountingServiceMock.createUser.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: { id: 1 },
        });
      });
      const req = createRequest({
        body: { name: 'test', username: 'test', password: 'test' },
      });
      await controller.createUser(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });

  describe('updateUser()', () => {
    it('updateUser: success', async () => {
      accountingServiceMock.updateUser.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: {
            id: 1,
            name: 'Updated user',
            username: 'default.user',
            updatedAt: '2023-12-23T10:07:02.609Z',
            result: true,
          },
        });
      });
      const req = createRequest({
        body: { id: 1, name: 'test' },
      });
      await controller.updateUser(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
      });
    });
  });
});
