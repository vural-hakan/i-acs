import { ClientRMQ } from '@nestjs/microservices';

export const accountingServiceClient = new ClientRMQ({
  urls: [
    `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`,
  ],
  queue: 'accounting_queue',
  queueOptions: {
    durable: true,
  },
});
