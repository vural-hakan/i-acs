import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Redis, RedisOptions } from 'ioredis';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  client: Redis;
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    const redisOptions: RedisOptions = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      db: parseInt(process.env.REDIS_JWT_DB),
      enableOfflineQueue: false,
    };

    this.client = new Redis(redisOptions);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );

    if (!secured) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // Bearer JWT authorization
    let bearerToken: string = request.headers.authorization;

    if (typeof bearerToken !== 'string') {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'Unauthorized Request',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    bearerToken = bearerToken?.replace('Bearer ', '');
    const userTokenInfo = await this.authService.verifyToken(bearerToken);

    const checkToken = await this.authService.checkToken(
      userTokenInfo?.user.userId,
      bearerToken,
    );

    if (!userTokenInfo || !checkToken) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        message: 'Unauthorized Request',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    // set user to request
    request.user = userTokenInfo?.user;
    return true;
  }
}
