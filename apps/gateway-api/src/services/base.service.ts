import { Logger } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';

export class BaseService {
  protected client: ClientRMQ;
  private readonly logger = new Logger('BasaeServiceLogger');
  constructor(client: ClientRMQ, service: string) {
    this.client = client;
    this.client.connect().catch((err) => {
      this.logger.error(service + ' service connection problem');
      this.logger.error(err);
    });
  }
}
