import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';
export class ListResponse extends CommonResponse {
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;

  @ApiProperty({
    default: {
      id: 1,
      number: 'ABC1234',
      userId: 1,
      createdAt: 1703329150706,
      updatedAt: 1703329175286,
    },
  })
  data: object;
}
