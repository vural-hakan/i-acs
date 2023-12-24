import {
  BadRequestException,
  Controller,
  HttpStatus,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { validateOrReject } from 'class-validator';

import { AuthProvider, IResponse } from '../../common';

import { UserDto } from './dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly userServices: UserService,
    private readonly authProvider: AuthProvider,
  ) {}

  @MessagePattern('listUsers')
  async listUsers(@Payload() message: unknown): Promise<IResponse> {
    const payload = new UserDto(message);
    await validateOrReject('UserDto', payload, {
      groups: ['listUsers'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const list = await this.userServices.listUsers(payload.page, payload.limit);

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: list,
    };
  }

  @MessagePattern('createUser')
  async createUser(@Payload() message: unknown): Promise<IResponse> {
    const payload = new UserDto(message);
    await validateOrReject('UserDto', payload, {
      groups: ['createUser'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const isExist = await this.userServices.checkUsername(payload.username);

    if (isExist) {
      throw new UnprocessableEntityException('Username already exist');
    }

    const hashed: string = await this.authProvider.hashPassword(
      payload.password,
    );

    const user = await this.userServices.createUser(
      payload.name,
      payload.username,
      hashed,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: {
        id: user.id,
      },
    };
  }

  @MessagePattern('updateUser')
  async updateUser(@Payload() message: unknown): Promise<IResponse> {
    const payload = new UserDto(message);
    await validateOrReject('UserDto', payload, {
      groups: ['updateUser'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });

    const user = await this.userServices.getUser(payload.id);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    const result = await this.userServices.updateUser(user, {
      name: payload.name,
    });
    if (!result) {
      throw new UnprocessableEntityException('User cannot updated');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        updatedAt: new Date(),
        result: result,
      },
    };
  }

  @MessagePattern('auth')
  async auth(@Payload() message: unknown): Promise<IResponse> {
    const payload = new UserDto(message);
    await validateOrReject('UserDto', payload, {
      groups: ['auth'],
    }).catch((err) => {
      throw new BadRequestException(err);
    });
    const user = await this.userServices.getUserByUsername(payload.username);
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    const result = await this.authProvider.comparePasswords(
      payload.password,
      user.password,
    );

    if (!result) {
      throw new UnauthorizedException('Authentication Failed');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        updatedAt: new Date(),
        result: result,
      },
    };
  }
}
