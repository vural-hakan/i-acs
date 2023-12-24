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
      name: 'Test Device',
      createdAt: 1703327295093,
      updatedAt: 1703327295093,
    },
  })
  data: object;
}
