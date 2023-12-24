import {
  BadRequestException,
  HttpStatus,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthProvider } from '../../common';

import { UserEntity } from './entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let authProvider: AuthProvider;
  const userMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        AuthProvider,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    authProvider = module.get<AuthProvider>(AuthProvider);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listUsers()', () => {
    it('dto validation exception', async () => {
      await controller
        .listUsers({
          limit: 'asd',
          page: 0,
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
        });
    });

    it('valid request', async () => {
      userMock.find.mockImplementationOnce(() => {
        return [
          {
            id: 1,
            name: 'test',
            username: 'test',
          },
        ];
      });
      const res = await controller.listUsers({
        limit: 0,
        page: 0,
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });

    it('valid request with pagination', async () => {
      userMock.find.mockImplementationOnce(() => {
        return [
          {
            id: 1,
            name: 'test',
            username: 'test',
          },
        ];
      });
      const res = await controller.listUsers({
        limit: 5,
        page: 2,
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('createUser()', () => {
    it('dto validation exception', async () => {
      await controller
        .createUser({
          name: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
        });
    });

    it('username exist exception', async () => {
      userMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
          username: 'test',
        } as UserEntity;
      });
      await controller
        .createUser({
          name: 'test',
          username: 'test',
          password: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('Username already exist');
        });
    });

    it('valid request', async () => {
      userMock.create.mockImplementationOnce(() => {
        return {
          name: 'test',
          username: 'test',
          password: 'test',
        } as UserEntity;
      });
      userMock.upsert.mockImplementationOnce(() => {
        return {
          generatedMaps: [
            {
              name: 'test',
              username: 'test',
              password: 'test',
            } as UserEntity,
          ],
        };
      });
      const res = await controller.createUser({
        name: 'test',
        username: 'test',
        password: 'test',
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('updateUser()', () => {
    it('dto validation exception', async () => {
      await controller
        .updateUser({
          name: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(BadRequestException);
        });
    });

    it('user not found exception', async () => {
      userMock.findOne.mockImplementationOnce(() => {
        return null;
      });
      await controller
        .updateUser({
          id: 1,
          name: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('User not found');
        });
    });

    it('user cannot update exception', async () => {
      userMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
          username: 'test',
        } as UserEntity;
      });
      userMock.update.mockImplementationOnce(() => {
        return {
          affected: 0,
        };
      });
      await controller
        .updateUser({
          id: 1,
          name: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('User cannot updated');
        });
    });

    it('valid request', async () => {
      userMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
          username: 'test',
        } as UserEntity;
      });
      userMock.update.mockImplementationOnce(() => {
        return {
          affected: 1,
        };
      });
      const res = await controller.updateUser({
        id: 1,
        name: 'test',
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });

  describe('auth()', () => {
    it('dto validation exception', async () => {
      await controller.auth({}).catch((error) => {
        expect(error).toBeInstanceOf(BadRequestException);
      });
    });

    it('user not found exception', async () => {
      userMock.findOne.mockImplementationOnce(() => {
        return null;
      });
      await controller
        .auth({
          username: 'test',
          password: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnprocessableEntityException);
          expect(error.message).toBe('User not found');
        });
    });

    it('Authentication Failed', async () => {
      userMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
          password: 'test',
        } as UserEntity;
      });
      await controller
        .auth({
          username: 'test',
          password: 'test',
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(UnauthorizedException);
          expect(error.message).toBe('Authentication Failed');
        });
    });

    it('valid request', async () => {
      const hashedPassword = await authProvider.hashPassword('test');
      userMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          name: 'test',
          password: hashedPassword,
        } as UserEntity;
      });
      const res = await controller.auth({
        username: 'test',
        password: 'test',
      });
      expect(res.statusCode).toEqual(HttpStatus.OK);
    });
  });
});
