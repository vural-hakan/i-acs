import { ApiProperty } from '@nestjs/swagger';

export class GetAllowedDevicesRequest {
  @ApiProperty({
    default: 'ABC1234',
    required: true,
  })
  cardNumber: string;
}
