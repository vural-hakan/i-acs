import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import './config/configuration'; // Import the configuration settings

import { AppModule } from './app.module';
import { AllExceptionFilter, LoggingInterceptor } from './common';

async function bootstrap() {
  // Define the log levels based on the environment
  const logger: LogLevel[] =
    process.env.NODE_ENV === 'local'
      ? ['error', 'warn', 'log', 'debug', 'verbose']
      : ['error', 'warn'];

  // Configure the microservice transporter with logger settings and TCP transport
  const transporter = {
    logger: logger,
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`,
      ],
      queue: 'accounting_queue',
      queueOptions: {
        durable: true,
      },
    },
  };

  // Create a Nest.js microservice with the AppModule and transporter configuration
  const app = await NestFactory.createMicroservice(AppModule, transporter);

  app.useGlobalFilters(new AllExceptionFilter());

  // Use a global interceptor to log request times using the LoggingInterceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Start the microservice and listen for incoming requests
  await app.listen();
}

// Call the bootstrap function to start the microservice
bootstrap();
