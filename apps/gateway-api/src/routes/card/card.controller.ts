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
  AddDevicePermissionRequest,
  AddDevicePermissionResponse,
  AssignToUserRequest,
  AssignToUserResponse,
  CreateRequest,
  CreateResponse,
  GetAllowedDevicesRequest,
  GetAllowedDevicesResponse,
  GetUserCardsRequest,
  GetUserCardsResponse,
  ListRequest,
  ListResponse,
} from './interfaces';

@Controller()
@ApiTags('card')
export class CardController {
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
    summary: `List cards`,
  })
  @ApiOkResponse({
    type: ListResponse,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listCards(@Query() query: ListRequest): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.listCards(
        parseInt(query.limit, 10),
        parseInt(query.page, 10),
      ),
    );
    return response;
  }

  @ApiOperation({
    summary: `Create new card`,
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
  async createCard(@Req() request: Request): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.createCard(request.body.number),
    );
    return response;
  }

  @ApiOperation({
    summary: `Assign existing card to user`,
  })
  @ApiOkResponse({
    type: AssignToUserResponse,
  })
  @ApiBody({
    type: AssignToUserRequest,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Post('assign-to-user')
  async assignToUser(@Req() request: Request): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.assignToUser(
        request.body.number,
        request.body.userId,
      ),
    );
    return response;
  }

  @ApiOperation({
    summary: `Get user cards`,
  })
  @ApiOkResponse({
    type: GetUserCardsResponse,
  })
  @ApiBody({
    type: GetUserCardsRequest,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Post('get-user-cards')
  async getUserCards(@Req() request: Request): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.getUserCards(parseInt(request.body.userId)),
    );
    return response;
  }

  @ApiOperation({
    summary: `Get allowed devices`,
  })
  @ApiOkResponse({
    type: GetAllowedDevicesResponse,
  })
  @ApiBody({
    type: GetAllowedDevicesRequest,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Post('get-allowed-devices')
  async getAllowedDevices(@Req() request: Request): Promise<CommonResponse> {
    await lastValueFrom(
      this.accountingService.checkCardIsExist(request.body.cardNumber),
    );

    const response = await lastValueFrom(
      this.authorizationService.getAllowedDevices(request.body.cardNumber),
    );

    return response;
  }

  @ApiOperation({
    summary: `Add device permission`,
  })
  @ApiOkResponse({
    type: AddDevicePermissionResponse,
  })
  @ApiBody({
    type: AddDevicePermissionRequest,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Post('add-device-permission')
  async addDevicePermission(@Req() request: Request): Promise<CommonResponse> {
    await lastValueFrom(
      this.accountingService.checkDeviceIsExist(request.body.deviceId),
    );

    await lastValueFrom(
      this.accountingService.checkCardIsExist(request.body.cardNumber),
    );

    const response = await lastValueFrom(
      this.authorizationService.addDevicePermission(
        request.body.deviceId,
        request.body.cardNumber,
      ),
    );

    return response;
  }
}
