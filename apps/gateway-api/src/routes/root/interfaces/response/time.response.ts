import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';

export class TimeResponse extends CommonResponse {
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
      serverTime: new Date().getTime(),
    },
  })
  data?: { [key: string]: unknown };
}
