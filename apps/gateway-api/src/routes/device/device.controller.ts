import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

import { Authorization, CommonResponse } from '../../common';
import { AccountingService, AuthorizationService } from '../../services';

import {
  CreateRequest,
  CreateResponse,
  GetAllowedCardsRequest,
  GetAllowedCardsResponse,
  ListRequest,
  ListResponse,
  UpdateRequest,
  UpdateResponse,
} from './interfaces';

@Controller()
@ApiTags('device')
export class DeviceController {
  constructor(
    private readonly accountingService: AccountingService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiOperation({
    summary: `List devices`,
  })
  @ApiOkResponse({
    type: ListResponse,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listDevices(@Query() query: ListRequest): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.listDevices(
        parseInt(query.limit, 10),
        parseInt(query.page, 10),
      ),
    );
    return response;
  }

  @ApiOperation({
    summary: `Create new device`,
  })
  @ApiOkResponse({
    type: CreateResponse,
  })
  @ApiBody({
    type: CreateRequest,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Post('create')
  async createDevice(@Req() request: Request): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.createDevice(request.body.name),
    );
    return response;
  }

  @ApiOperation({
    summary: `Update existing device`,
  })
  @ApiOkResponse({
    type: UpdateResponse,
  })
  @ApiBody({
    type: UpdateRequest,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Post('update')
  async updateDevice(@Req() request: Request): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.updateDevice(request.body.id, request.body.name),
    );
    return response;
  }

  @ApiOperation({
    summary: `Get allowed cards`,
  })
  @ApiOkResponse({
    type: GetAllowedCardsResponse,
  })
  @ApiBody({
    type: GetAllowedCardsRequest,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Post('get-allowed-cards')
  async getAllowedCards(@Req() request: Request): Promise<CommonResponse> {
    await lastValueFrom(
      this.accountingService.checkDeviceIsExist(request.body.deviceId),
    );

    const response = await lastValueFrom(
      this.authorizationService.getAllowedCards(request.body.deviceId),
    );
    return response;
  }
}
