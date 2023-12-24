import { ApiProperty } from '@nestjs/swagger';

export class GetAllowedCardsRequest {
  @ApiProperty({
    default: 1,
    required: true,
  })
  deviceId: number;
}
