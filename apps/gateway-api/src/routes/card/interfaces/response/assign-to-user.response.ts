import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';
export class AssignToUserResponse extends CommonResponse {
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;

  @ApiProperty({
    default: {
      id: 1,
      name: 'ABC1234',
      updatedAt: '2023-12-23T10:59:35.290Z',
      result: true,
    },
  })
  data: object;
}
