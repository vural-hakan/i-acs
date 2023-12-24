import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

import { AuthService, CommonResponse, UserInterface } from '../../common';
import { AccountingService } from '../../services';

import {
  AuthRequest,
  AuthResponse,
  ErrorResponse,
  PingResponse,
  TimeResponse,
} from './interfaces';

@Controller()
@ApiTags('root')
export class RootController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountingService: AccountingService,
  ) {}
  @ApiOperation({
    summary: `Gateway connectivity ping/pong test endpoint`,
  })
  @ApiOkResponse({ type: PingResponse })
  @HttpCode(HttpStatus.OK)
  @Get('ping')
  async ping(): Promise<CommonResponse> {
    return {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: {
        message: 'pong',
      },
    };
  }

  @ApiOperation({
    summary: `Gateway service unavailable test endpoint`,
  })
  @ApiOkResponse({ type: ErrorResponse })
  @HttpCode(HttpStatus.SERVICE_UNAVAILABLE)
  @Get('error')
  async error(): Promise<CommonResponse> {
    throw new ServiceUnavailableException();
  }

  @ApiOperation({
    summary: `Check server time endpoint`,
  })
  @ApiOkResponse({
    type: TimeResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Get('time')
  async time(): Promise<CommonResponse> {
    const response = {
      statusCode: HttpStatus.OK,
      message: 'SUCCESS',
      data: {
        serverTime: new Date().getTime(),
      },
    };
    return response;
  }

  @ApiOperation({
    summary: `Login endpoint with username and password`,
  })
  @ApiBody({
    type: AuthRequest,
  })
  @ApiOkResponse({
    type: AuthResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('auth')
  async auth(@Req() req: Request): Promise<CommonResponse> {
    const { username, password } = req.body;
    const user = await lastValueFrom(
      this.accountingService.auth(username, password),
    );
    const userData = { ...user.data } as UserInterface;
    const tokens = await this.authService.createToken(userData);
    return {
      statusCode: user.statusCode,
      message: user.message,
      data: {
        tokens,
        user: {
          ...userData,
        },
      },
    };
  }
}
