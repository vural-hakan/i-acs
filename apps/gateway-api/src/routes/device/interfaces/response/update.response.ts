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
      name: 'Updated Device',
      updatedAt: '2023-12-23T10:28:15.093Z',
      result: true,
    },
  })
  data: object;
}
