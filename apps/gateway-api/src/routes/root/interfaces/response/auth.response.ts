import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';
export class AuthResponse extends CommonResponse {
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;

  @ApiProperty({
    default: {
      tokens: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiRGVmYXVsdCBVc2VyIiwidXNlcm5hbWUiOiJkZWZhdWx0LnVzZXIiLCJ1cGRhdGVkQXQiOiIyMDIzLTEyLTIyVDE0OjQ2OjAyLjk2MFoiLCJyZXN1bHQiOnRydWV9LCJpYXQiOjE3MDMyNTYzNjIsImV4cCI6MTcwMzM0Mjc2Mn0.aJjQesL46kR3r1uYiSYqJKbHQUkUlhpK28OEt0hKUSY',
        refreshToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDMyNTYzNjIsImV4cCI6MTcwMzg2MTE2Mn0.vXV9DJLWXVBO2eV1uGnDywl1tE70uoCv2b4nsHyuA0E',
      },
      user: {
        id: 1,
        name: 'Default User',
        username: 'default.user',
        updatedAt: '2023-12-22T14:46:02.960Z',
        result: true,
      },
    },
  })
  data: object;
}
