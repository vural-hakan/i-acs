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
      name: 'Default User',
      username: 'default.user',
      createdAt: 1703316684220,
      updatedAt: 1703316684220,
    },
  })
  data: object;
}
