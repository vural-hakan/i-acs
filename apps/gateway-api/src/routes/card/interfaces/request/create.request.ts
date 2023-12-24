import { ApiProperty } from '@nestjs/swagger';

export class CreateRequest {
  @ApiProperty({
    default: 'ABC1234',
    required: true,
  })
  number: string;
}
