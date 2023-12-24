import { ClientRMQ } from '@nestjs/microservices';

export const authorizationServiceClient = new ClientRMQ({
  urls: [
    `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`,
  ],
  queue: 'authorization_queue',
  queueOptions: {
    durable: true,
  },
});
