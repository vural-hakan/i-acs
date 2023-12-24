import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({
    default: HttpStatus.SERVICE_UNAVAILABLE,
  })
  statusCode: number;

  @ApiProperty({
    default: 'Service Unavailable',
  })
  message: string;
}
