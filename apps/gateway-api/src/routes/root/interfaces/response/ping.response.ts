import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';

export class PingResponse extends CommonResponse {
  @ApiProperty({
    default: HttpStatus.OK,
  })
  statusCode: number;
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;
  @ApiProperty({
    default: {
      message: 'pong',
    },
  })
  data: {
    message: string;
  };
}
