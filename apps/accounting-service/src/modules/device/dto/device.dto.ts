import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DeviceDto {
  constructor(data: unknown) {
    Object.assign(this, data);
  }

  @IsNotEmpty({
    message: 'ID MUST BE VALID',
    groups: ['updateDevice', 'checkDeviceIsExist'],
  })
  @IsNumber(
    {},
    {
      message: 'ID MUST BE NUMBER',
      groups: ['updateDevice', 'checkDeviceIsExist'],
    },
  )
  id: number;

  @IsString({
    message: 'NAME MUST BE VALID',
    groups: ['createDevice', 'updateDevice'],
  })
  @IsNotEmpty({
    message: 'NAME MUST BE VALID',
    groups: ['createDevice', 'updateDevice'],
  })
  name: string;

  @IsOptional({
    groups: ['listDevices'],
  })
  @IsNumber(
    {},
    {
      message: 'LIMIT MUST BE NUMBER',
      groups: ['listDevices'],
    },
  )
  limit: number;

  @IsOptional({
    groups: ['listDevices'],
  })
  @IsNumber(
    {},
    {
      message: 'PAGE MUST BE NUMBER',
      groups: ['listDevices'],
    },
  )
  page: number;
}
