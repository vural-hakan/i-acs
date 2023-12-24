import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AccessListDTO {
  constructor(data: unknown) {
    Object.assign(this, data);
  }

  @IsNotEmpty({
    message: 'DEVICE ID MUST BE VALID',
    groups: ['getAllowedCards', 'addDevicePermission'],
  })
  @IsNumber(
    {},
    {
      message: 'DEVICE ID MUST BE NUMBER',
      groups: ['getAllowedCards', 'addDevicePermission'],
    },
  )
  deviceId: number;

  @IsString({
    message: 'CARD NUMBER MUST BE VALID',
    groups: ['getAllowedDevices', 'addDevicePermission'],
  })
  @IsNotEmpty({
    message: 'CARD NUMBER MUST BE VALID',
    groups: ['getAllowedDevices', 'addDevicePermission'],
  })
  cardNumber: string;
}
