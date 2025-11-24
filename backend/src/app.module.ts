import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Vehicle } from './vehicles/entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'database.sqlite',
      entities: [Vehicle],
      synchronize: true,
    }),
    VehiclesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
