import { ApiProperty } from '@nestjs/swagger';

export class CreateRequest {
  @ApiProperty({
    default: 'Test Device',
    required: true,
  })
  name: string;
}
