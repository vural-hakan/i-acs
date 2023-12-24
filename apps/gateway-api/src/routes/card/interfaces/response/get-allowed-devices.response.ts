import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';
export class GetAllowedDevicesResponse extends CommonResponse {
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;

  @ApiProperty({
    default: ['1'],
  })
  data: object;
}
