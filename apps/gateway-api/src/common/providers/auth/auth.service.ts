/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Redis, RedisOptions } from 'ioredis';

import { UserInterface } from '../../interfaces';

@Injectable()
export class AuthService {
  client: Redis;
  constructor(private readonly jwtService: JwtService) {
    const redisOptions: RedisOptions = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      db: parseInt(process.env.REDIS_JWT_DB),
      enableOfflineQueue: false,
    };

    this.client = new Redis(redisOptions);
  }

  generateKey(userId: number): string {
    return `user_` + userId;
  }

  async createToken(
    user: UserInterface,
  ): Promise<{ token: string; refreshToken: string }> {
    // create tokens
    const [token, refreshToken] = await Promise.all([
      // access token
      this.jwtService
        .signAsync(
          { sub: user.userId, user },
          {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
          },
        )
        .catch(() => {
          throw new UnauthorizedException();
        }),
      // refresh token
      this.jwtService
        .signAsync(
          { sub: user.userId },
          {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
          },
        )
        .catch(() => {
          throw new UnauthorizedException();
        }),
    ]);

    const key: string = this.generateKey(user.userId);

    const decodeToken = await this.decodeToken(refreshToken);
    const tokenExpiredAt = parseInt(decodeToken.exp);
    const now = Math.floor(new Date().getTime() / 1000);

    // save tokens to redis
    await this.client.hmset(key, {
      token,
      refreshToken,
    });
    await this.client.expire(key, tokenExpiredAt - now);

    return { token, refreshToken };
  }

  async checkToken(userId: number, token: string): Promise<boolean> {
    const key: string = this.generateKey(userId);

    // get token from redis
    const getToken: unknown = await this.client.hget(key, 'token');

    if (getToken === token) {
      return true;
    }

    return false;
  }

  async checkRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<boolean> {
    const key: string = this.generateKey(userId);

    // get refresh token from redis
    const getRefreshToken: unknown = await this.client.hget(
      key,
      'refreshToken',
    );

    if (getRefreshToken === refreshToken) {
      return true;
    }

    return false;
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService
      .verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  async decodeToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }

  async verifyRefreshToken(refreshToken: string): Promise<any> {
    return this.jwtService
      .verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
  }

  async deleteToken(userId: number): Promise<number> {
    const key: string = this.generateKey(userId);

    // delete token from redis
    const deletedToken: number = await this.client.del(key);

    return deletedToken;
  }
}
