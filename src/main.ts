import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'product_queue',
      queueOptions: {
        durable: true,
      },
      heartbeat: 30,
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('API rodando em http://localhost:3000');
  console.log('Microservice RabbitMQ conectado!');
}
bootstrap();
