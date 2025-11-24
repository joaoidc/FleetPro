import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let repository: Repository<Vehicle>;

  const mockVehicle = {
    id: 1,
    placa: 'ABC1234',
    chassi: '1234567890',
    renavam: '123456789',
    modelo: 'Fusca',
    marca: 'Volkswagen',
    ano: 1980,
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockVehicle),
    save: jest.fn().mockResolvedValue(mockVehicle),
    find: jest.fn().mockResolvedValue([mockVehicle]),
    findOne: jest.fn().mockResolvedValue(mockVehicle),
    merge: jest.fn(),
    remove: jest.fn().mockResolvedValue(mockVehicle),
  };

  const mockClientProxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: mockRepository,
        },
        {
          provide: 'NOTIFICATIONS_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    repository = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle));
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um veículo e emitir um evento', async () => {
      const createDto = { ...mockVehicle, id: undefined };
      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockVehicle);
      expect(mockClientProxy.emit).toHaveBeenCalledWith(
        'vehicle_created',
        mockVehicle,
      );
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de veículos', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockVehicle]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um veículo por ID', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockVehicle);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar NotFoundException se o veículo não for encontrado', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(99)).rejects.toThrow(
        'Veículo com ID 99 não encontrado',
      );
    });
  });

  describe('update', () => {
    it('deve atualizar um veículo', async () => {
      const updateDto = { modelo: 'Brasilia' };
      const updatedVehicle = { ...mockVehicle, ...updateDto };
      jest.spyOn(repository, 'save').mockResolvedValueOnce(updatedVehicle);

      const result = await service.update(1, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.merge).toHaveBeenCalledWith(mockVehicle, updateDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockVehicle);
      expect(result).toEqual(updatedVehicle);
    });
  });

  describe('remove', () => {
    it('deve remover um veículo', async () => {
      const result = await service.remove(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockVehicle);
      expect(result).toEqual(mockVehicle);
    });
  });
});
