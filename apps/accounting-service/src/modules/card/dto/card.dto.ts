import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CardDto {
  constructor(data: unknown) {
    Object.assign(this, data);
  }

  @IsString({
    message: 'CARD NUMBER MUST BE STRING',
    groups: ['createCard', 'assignToUser', 'checkCardIsExist'],
  })
  @IsNotEmpty({
    message: 'CARD NUMBER MUST BE VALID',
    groups: ['createCard', 'assignToUser', 'checkCardIsExist'],
  })
  number: string;

  @IsOptional({
    groups: ['listCards'],
  })
  @IsNumber(
    {},
    {
      message: 'LIMIT MUST BE NUMBER',
      groups: ['listCards'],
    },
  )
  limit: number;

  @IsOptional({
    groups: ['listCards'],
  })
  @IsNumber(
    {},
    {
      message: 'PAGE MUST BE NUMBER',
      groups: ['listCards'],
    },
  )
  page: number;

  @IsNotEmpty({
    message: 'USER ID MUST BE VALID',
    groups: ['assignToUser'],
  })
  @IsNumber(
    {},
    {
      message: 'USER ID MUST BE NUMBER',
      groups: ['assignToUser', 'getUserCards'],
    },
  )
  userId: number;
}
