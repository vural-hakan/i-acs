import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';

import { AuthService } from '../../..';

import { AuthGuard } from './auth.guard';
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [AuthGuard, AuthService, Reflector],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);

    reflector = module.get<Reflector>(Reflector);
  });

  it('should initialize Redis clients', () => {
    expect(guard.client).toBeInstanceOf(Redis);
  });

  it('should throw error header is missing', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['user']);

    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(() => ({
          headers: {},
        })),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw error token is wrong', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['user']);

    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(() => ({
          headers: {
            authorization: 'Bearer Test',
          },
        })),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
