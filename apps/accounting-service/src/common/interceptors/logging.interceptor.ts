import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // Create an instance of the Logger
  private readonly logger = new Logger('LoggingTool');

  // Implement the intercept method required by NestInterceptor
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        // Log the time
        this.logger.log(`Request time: ${Date.now() - now}ms`);
      }),
    );
  }
}
