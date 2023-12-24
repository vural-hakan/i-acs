import { ApiProperty } from '@nestjs/swagger';
export class AuthRequest {
  @ApiProperty({
    default: 'default.user',
  })
  username: string;

  @ApiProperty({
    default: '123456',
  })
  password: string;
}
