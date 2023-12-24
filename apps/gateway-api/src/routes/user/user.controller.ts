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
import { AccountingService } from '../../services';

import {
  CreateRequest,
  CreateResponse,
  ListRequest,
  ListResponse,
  UpdateRequest,
  UpdateResponse,
} from './interfaces';

@Controller()
@ApiTags('user')
export class UserController {
  constructor(private readonly accountingService: AccountingService) {}

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
    summary: `List users`,
  })
  @ApiOkResponse({
    type: ListResponse,
  })
  @Authorization(true)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async listUsers(@Query() query: ListRequest): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.listUsers(
        parseInt(query.limit, 10),
        parseInt(query.page, 10),
      ),
    );
    return response;
  }

  @ApiOperation({
    summary: `Create new user`,
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
  async createUser(@Req() request: Request): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.createUser(
        request.body.name,
        request.body.username,
        request.body.password,
      ),
    );
    return response;
  }

  @ApiOperation({
    summary: `Update existing user`,
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
  async updateUser(@Req() request: Request): Promise<CommonResponse> {
    const response = await lastValueFrom(
      this.accountingService.updateUser(request.body.id, request.body.name),
    );
    return response;
  }
}
