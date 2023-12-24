import { ApiProperty } from '@nestjs/swagger';

export class AssignToUserRequest {
  @ApiProperty({
    default: 'ABC1234',
    required: true,
  })
  number: string;

  @ApiProperty({
    default: 1,
    required: true,
  })
  userId: number;
}
