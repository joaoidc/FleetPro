import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterVehicleDto {
  @ApiPropertyOptional({
    description: 'Filtrar por placa do veículo',
    example: 'ABC1D23',
  })
  @IsOptional()
  @IsString()
  placa?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por modelo do veículo',
    example: 'Corolla',
  })
  @IsOptional()
  @IsString()
  modelo?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por marca do veículo',
    example: 'Toyota',
  })
  @IsOptional()
  @IsString()
  marca?: string;
}
