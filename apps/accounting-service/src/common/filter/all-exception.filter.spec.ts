import { HttpException } from '@nestjs/common';

import { AllExceptionFilter } from './';

describe('AllExceptionFilter', () => {
  it('should be defined', () => {
    expect(AllExceptionFilter).toBeDefined();
  });

  it('should transform validation errors', () => {
    const exception = new HttpException(
      {
        message: 'Test Exception',
      },
      400,
    );

    const filter = new AllExceptionFilter();

    try {
      filter.catch(exception);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
