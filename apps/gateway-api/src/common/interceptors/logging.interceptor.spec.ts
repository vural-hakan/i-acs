import { CallHandler } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { createMocks } from 'node-mocks-http';
import { lastValueFrom, of } from 'rxjs';

import { LoggingInterceptor } from '.';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeAll(() => {
    interceptor = new LoggingInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should remove the name', async () => {
    const { req, res } = createMocks();
    const testContext = new ExecutionContextHost([req, res]);
    const nextSpy: CallHandler<unknown> = {
      handle: () => of({ x: 'x', value: { test: 'test' } }),
    };

    expect(
      lastValueFrom(interceptor.intercept(testContext, nextSpy)),
    ).toBeDefined();
  });
});
