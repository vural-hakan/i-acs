import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionFilter');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    // All Exception Handler for reporting
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //Share with slack or any third-party platform
    this.logger.error(
      `
      Request Error
      Status Code: ${exception.status}
      Details:
      ${JSON.stringify(exception, null, 2)}
      `,
    );
    if (exception.message === 'Internal server error') {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(exception);
    } else {
      response.status(exception.status).json(exception.response);
    }
  }
}
