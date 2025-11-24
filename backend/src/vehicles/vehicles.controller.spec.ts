import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

describe('VehiclesController', () => {
  let controller: VehiclesController;

  const mockVehicle = {
    id: 1,
    placa: 'ABC1234',
    chassi: '12345678901234567',
    renavam: '12345678901',
    modelo: 'Fusca',
    marca: 'VW',
    ano: 1980,
  };

  const mockVehiclesService = {
    create: jest.fn().mockResolvedValue(mockVehicle),
    findAll: jest.fn().mockResolvedValue([mockVehicle]),
    findOne: jest.fn().mockResolvedValue(mockVehicle),
    update: jest.fn().mockResolvedValue(mockVehicle),
    remove: jest.fn().mockResolvedValue(mockVehicle),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve criar um veículo', async () => {
    const dto: CreateVehicleDto = {
      placa: 'ABC1234',
      chassi: '12345678901234567',
      renavam: '12345678901',
      modelo: 'Fusca',
      marca: 'VW',
      ano: 1980,
    };
    expect(await controller.create(dto)).toEqual(mockVehicle);
    expect(mockVehiclesService.create).toHaveBeenCalledWith(dto);
  });

  it('deve encontrar todos os veículos', async () => {
    expect(await controller.findAll({}, { page: 1, limit: 10 })).toEqual([
      mockVehicle,
    ]);
    expect(mockVehiclesService.findAll).toHaveBeenCalled();
  });

  it('deve encontrar um veículo por ID', async () => {
    expect(await controller.findOne('1')).toEqual(mockVehicle);
    expect(mockVehiclesService.findOne).toHaveBeenCalledWith(1);
  });
});
