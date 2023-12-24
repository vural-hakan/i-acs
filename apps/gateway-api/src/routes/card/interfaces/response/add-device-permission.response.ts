import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';
export class AddDevicePermissionResponse extends CommonResponse {
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  data: object;
}
