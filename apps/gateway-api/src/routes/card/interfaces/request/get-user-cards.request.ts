import { ApiProperty } from '@nestjs/swagger';

export class GetUserCardsRequest {
  @ApiProperty({
    default: 1,
    required: true,
  })
  userId: number;
}
