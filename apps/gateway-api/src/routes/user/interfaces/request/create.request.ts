import { ApiProperty } from '@nestjs/swagger';

export class CreateRequest {
  @ApiProperty({
    default: 'Test User',
    required: true,
  })
  name: string;

  @ApiProperty({
    default: 'test.user',
    required: true,
  })
  username: string;

  @ApiProperty({
    default: 'test.password',
    required: true,
  })
  password: string;
}
