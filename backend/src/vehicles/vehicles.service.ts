import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @Inject('NOTIFICATIONS_SERVICE') private client: ClientProxy,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const existingVehicle = await this.vehiclesRepository.findOne({
      where: { placa: createVehicleDto.placa },
    });

    if (existingVehicle) {
      throw new ConflictException(
        `Já existe um veículo cadastrado com a placa ${createVehicleDto.placa}`,
      );
    }

    const vehicle = this.vehiclesRepository.create(createVehicleDto);
    const savedVehicle = await this.vehiclesRepository.save(vehicle);

    try {
      this.client.emit('vehicle_created', savedVehicle);
    } catch (error) {
      console.error('Erro ao emitir evento para RabbitMQ:', error);
    }

    return savedVehicle;
  }

  async findAll(filterDto?: FilterVehicleDto, paginationDto?: PaginationDto) {
    const where: FindOptionsWhere<Vehicle> = {};

    if (filterDto?.placa) {
      where.placa = Like(`%${filterDto.placa}%`);
    }

    if (filterDto?.modelo) {
      where.modelo = Like(`%${filterDto.modelo}%`);
    }

    if (filterDto?.marca) {
      where.marca = Like(`%${filterDto.marca}%`);
    }

    const page = paginationDto?.page || 1;
    const limit = paginationDto?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.vehiclesRepository.findAndCount({
      where,
      take: limit,
      skip: skip,
      order: { id: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id);

    // Se a placa está sendo atualizada, verifica se já existe outro veículo com essa placa
    if (updateVehicleDto.placa && updateVehicleDto.placa !== vehicle.placa) {
      const existingVehicle = await this.vehiclesRepository.findOne({
        where: { placa: updateVehicleDto.placa },
      });

      if (existingVehicle) {
        throw new ConflictException(
          `Já existe um veículo cadastrado com a placa ${updateVehicleDto.placa}`,
        );
      }
    }

    this.vehiclesRepository.merge(vehicle, updateVehicleDto);
    return this.vehiclesRepository.save(vehicle);
  }

  async remove(id: number) {
    const vehicle = await this.findOne(id);
    return this.vehiclesRepository.remove(vehicle);
  }
}
