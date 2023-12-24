import { ApiProperty } from '@nestjs/swagger';

export class AddDevicePermissionRequest {
  @ApiProperty({
    default: 1,
    required: true,
  })
  deviceId: number;

  @ApiProperty({
    default: 'ABC1234',
    required: true,
  })
  cardNumber: string;
}
