import { ApiProperty } from '@nestjs/swagger';

export class UpdateRequest {
  @ApiProperty({
    default: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    default: 'Updated user',
    required: true,
  })
  name: string;
}
