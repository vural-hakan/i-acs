import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';

import '../../../config/configuration';

import { UserInterface } from '../../interfaces';

import { AuthService } from './auth.service';
describe('AuthService', () => {
  let authService: AuthService;
  let redisClient: Redis;
  let token: string;
  let refreshToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    // Mock Redis client
    redisClient = {
      hmset: jest.fn(),
      expire: jest.fn(),
      hget: jest.fn(),
      del: jest.fn(),
    } as unknown as Redis;

    authService.client = redisClient;
  });

  describe('createToken', () => {
    it('should return tokens', async () => {
      const user: UserInterface = {
        userId: 1,
        name: 'test',
      };

      (redisClient.hmset as jest.Mock).mockResolvedValueOnce('OK');
      (redisClient.expire as jest.Mock).mockResolvedValueOnce('OK');

      const result = await authService.createToken(user);

      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      expect(redisClient.hmset).toHaveBeenCalledWith('user_1', {
        token: result.token,
        refreshToken: result.refreshToken,
      });
      token = result.token;
      refreshToken = result.refreshToken;
    });
  });

  describe('checkToken', () => {
    it('should return true if token is valid', async () => {
      const userId = 1;
      (redisClient.hget as jest.Mock).mockResolvedValueOnce(token);
      const result = await authService.checkToken(userId, token);
      expect(result).toBe(true);
      expect(redisClient.hget).toHaveBeenCalledWith('user_1', 'token');
    });

    it('should return false if token is invalid', async () => {
      const userId = 1;
      const token = 'invalidToken';

      (redisClient.hget as jest.Mock).mockResolvedValueOnce('anotherToken');

      const result = await authService.checkToken(userId, token);

      expect(result).toBe(false);

      expect(redisClient.hget).toHaveBeenCalledWith('user_1', 'token');
    });
  });

  describe('checkRefreshToken', () => {
    it('should return true if token is valid', async () => {
      const userId = 1;
      (redisClient.hget as jest.Mock).mockResolvedValueOnce(refreshToken);
      const result = await authService.checkRefreshToken(userId, refreshToken);
      expect(result).toBe(true);
      expect(redisClient.hget).toHaveBeenCalledWith('user_1', 'refreshToken');
    });

    it('should return false if token is invalid', async () => {
      const userId = 1;
      const token = 'invalidToken';

      (redisClient.hget as jest.Mock).mockResolvedValueOnce('anotherToken');

      const result = await authService.checkRefreshToken(userId, token);

      expect(result).toBe(false);

      expect(redisClient.hget).toHaveBeenCalledWith('user_1', 'refreshToken');
    });
  });

  describe('checkRefreshToken', () => {
    it('should return expire  if token is valid', async () => {
      const result = await authService.verifyRefreshToken(refreshToken);
      expect(result).toBeInstanceOf(Object);
      expect(result.exp).toBeDefined();
    });

    it('should throw error if token is invalid', async () => {
      await authService.verifyRefreshToken('invalid').catch((err) => {
        expect(err).toBeInstanceOf(UnauthorizedException);
      });
    });
  });

  describe('deleteToken', () => {
    it('should return expire  if token is valid', async () => {
      (redisClient.del as jest.Mock).mockResolvedValueOnce('OK');
      const result = await authService.deleteToken(1);
      expect(result).toBe('OK');
    });
  });
});
