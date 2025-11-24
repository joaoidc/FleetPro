import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  @EventPattern('vehicle_created')
  handleVehicleCreated(@Payload() data: any) {
    console.log(`[MICROSERVICE] Veículo criado recebido via RabbitMQ:`, data);
  }
}
