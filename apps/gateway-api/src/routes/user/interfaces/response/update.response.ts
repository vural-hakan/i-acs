import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';
export class UpdateResponse extends CommonResponse {
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;

  @ApiProperty({
    default: {
      id: 1,
      name: 'Updated user',
      username: 'default.user',
      updatedAt: '2023-12-23T10:07:02.609Z',
      result: true,
    },
  })
  data: object;
}
