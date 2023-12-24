import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AllExceptionFilter } from '.';
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};
describe('AllExceptionFilter', () => {
  let service: AllExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllExceptionFilter],
    }).compile();
    service = module.get<AllExceptionFilter>(AllExceptionFilter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Http exception', () => {
    service.catch(
      new HttpException('Http exception', HttpStatus.BAD_REQUEST),
      mockArgumentsHost,
    );

    expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockHttpArgumentsHost).toBeCalledTimes(1);
    expect(mockGetResponse).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledTimes(1);
    expect(mockJson).toBeCalledTimes(1);
  });
});
