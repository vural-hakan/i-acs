import { ApiProperty } from '@nestjs/swagger';

import { CommonResponse } from '../../../../common';
export class GetAllowedCardsResponse extends CommonResponse {
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;

  @ApiProperty({
    default: ['ABC1234'],
  })
  data: object;
}
