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
  private readonly logger = new Logger('ExceptionFilter');
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CallHandler> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        // FOR Logging all requests.(Required for NewRelic integration)
        this.logger.log(`Request time: ${Date.now() - now}ms`);
      }),
    );
  }
}
