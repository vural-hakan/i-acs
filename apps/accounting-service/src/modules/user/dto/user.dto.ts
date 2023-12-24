import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDto {
  constructor(data: unknown) {
    Object.assign(this, data);
  }

  @IsNotEmpty({
    message: 'ID MUST BE VALID',
    groups: ['updateUser'],
  })
  @IsNumber(
    {},
    {
      message: 'ID MUST BE NUMBER',
      groups: ['updateUser'],
    },
  )
  id: number;

  @IsString({
    message: 'USERNAME MUST BE VALID',
    groups: ['auth', 'createUser'],
  })
  @IsNotEmpty({
    message: 'USERNAME MUST BE VALID',
    groups: ['auth', 'createUser'],
  })
  username: string;

  @IsString({
    message: 'PASSWORD MUST BE VALID',
    groups: ['auth', 'createUser'],
  })
  @IsNotEmpty({
    message: 'PASSWORD MUST BE VALID',
    groups: ['auth', 'createUser'],
  })
  password: string;

  @IsString({
    message: 'NAME MUST BE VALID',
    groups: ['createUser', 'updateUser'],
  })
  @IsNotEmpty({
    message: 'NAME MUST BE VALID',
    groups: ['createUser', 'updateUser'],
  })
  name: string;

  @IsOptional({
    groups: ['listUsers'],
  })
  @IsNumber(
    {},
    {
      message: 'LIMIT MUST BE NUMBER',
      groups: ['listUsers'],
    },
  )
  limit: number;

  @IsOptional({
    groups: ['listUsers'],
  })
  @IsNumber(
    {},
    {
      message: 'PAGE MUST BE NUMBER',
      groups: ['listUsers'],
    },
  )
  page: number;
}
