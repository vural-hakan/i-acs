import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';
export class CreateResponse extends CommonResponse {
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;

  @ApiProperty({
    default: {
      id: 1,
    },
  })
  data: object;
}
