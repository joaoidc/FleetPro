import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Vehicle Management API')
    .setDescription('API para gestão de frota de veículos')
    .setVersion('1.0')
    .addTag('Veículos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  try {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'vehicles_queue',
        queueOptions: {
          durable: false,
        },
      },
    });

    await app.startAllMicroservices();
  } catch (error) {
    console.warn(
      'Não foi possível conectar ao RabbitMQ. O serviço funcionará sem filas.',
      error,
    );
  }

  await app.listen(3000);
}
bootstrap();
