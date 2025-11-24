import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { PaginationDto } from './dto/pagination.dto';
import {
  createResponse,
  findAllResponse,
  findOneResponse,
  updateResponse,
  removeResponse,
} from './swagger/vehicle.response';

@ApiTags('Veículos')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo veículo' })
  @ApiResponse(createResponse)
  @ApiResponse({ status: 409, description: 'Placa já cadastrada.' })
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os veículos',
    description:
      'Retorna uma lista paginada de veículos. Pode ser filtrada por placa, modelo ou marca.',
  })
  @ApiResponse(findAllResponse)
  findAll(
    @Query() filterDto: FilterVehicleDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.vehiclesService.findAll(filterDto, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um veículo pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse(findOneResponse)
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de um veículo' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse(updateResponse)
  @ApiResponse({ status: 404, description: 'Veículo não encontrado.' })
  @ApiResponse({ status: 409, description: 'Placa já cadastrada.' })
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(+id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um veículo' })
  @ApiParam({ name: 'id', description: 'ID do veículo' })
  @ApiResponse(removeResponse)
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }
}
