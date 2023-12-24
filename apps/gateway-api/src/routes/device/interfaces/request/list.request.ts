import { ApiProperty } from '@nestjs/swagger';

export class ListRequest {
  @ApiProperty({
    minimum: 0,
    maximum: 10000,
    example: 1,
    title: 'Page',
    required: false,
  })
  page: string;

  @ApiProperty({
    minimum: 0,
    maximum: 15,
    example: 10,
    title: 'Limit',
    required: false,
  })
  limit: string;
}
