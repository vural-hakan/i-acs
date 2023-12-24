import {
  Catch,
  ExceptionFilter,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  // Http Exception Handler for reporting
  catch(exception: unknown) {
    if (exception['response'] && exception['response']['statusCode']) {
      throw exception;
    } else {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unexpeected Error',
        error: 'Interval Server Error',
        details: exception,
        service: process.env.APP_ENV,
      });
    }
  }
}
