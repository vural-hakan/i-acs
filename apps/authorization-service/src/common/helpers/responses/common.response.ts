import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// Common Response Interface
export class CommonResponse {
  @ApiProperty({
    default: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    default: 'SUCCESS',
  })
  message?: string;

  @ApiProperty()
  data?: { [key: string]: unknown };
}
