import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createRequest } from 'node-mocks-http';
import { of } from 'rxjs';

import '../../config/configuration';

import { accountingServiceClient, AuthModule, AuthService } from '../../common';
import { AccountingService } from '../../services';

import { RootController, RootModule } from '.';
describe('RootController', () => {
  let controller: RootController;
  const accountingServiceMock = {
    auth: jest.fn(),
  };
  const authServiceMock = {
    createToken: jest.fn(),
  };

  beforeAll(async () => {
    const controllerTestModule: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      controllers: [RootController],
      providers: [
        {
          provide: 'client',
          useValue: accountingServiceClient,
        },
        {
          provide: AccountingService,
          useValue: accountingServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = controllerTestModule.get<RootController>(RootController);
  });

  it('Module should be defined', () => {
    expect(RootModule).toBeDefined();
  });

  it('Controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ping()', () => {
    it('ping: success', async () => {
      await controller.ping().then((res) => {
        expect(res.statusCode).toEqual(HttpStatus.OK);
      });
    });
  });

  describe('error()', () => {
    it('error: success', async () => {
      await controller.error().catch((error) => {
        expect(error).toBeInstanceOf(HttpException);
      });
    });
  });

  describe('time()', () => {
    it('time: success', async () => {
      await controller.time().then((res) => {
        expect(res.statusCode).toEqual(HttpStatus.OK);
      });
    });
  });

  describe('auth()', () => {
    it('auth: success', async () => {
      accountingServiceMock.auth.mockImplementationOnce(() => {
        return of({
          statusCode: HttpStatus.OK,
          message: 'SUCCESS',
          data: [],
        });
      });
      authServiceMock.createToken.mockImplementationOnce(() => {
        return {
          token: 'xxx',
          refreshToken: 'yyy',
        };
      });
      const req = createRequest({
        body: { username: 'default.user', password: '123456' },
      });
      await controller.auth(req).then((resp) => {
        expect(resp.statusCode).toBe(HttpStatus.OK);
        expect(accountingServiceMock.auth).toHaveBeenCalledTimes(1);
      });
    });
  });
});
