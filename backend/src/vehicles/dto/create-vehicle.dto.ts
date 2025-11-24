import {
  IsString,
  IsInt,
  IsNotEmpty,
  Matches,
  Min,
  Max,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'ABC1D23',
    description: 'Placa no formato Antigo ou Mercosul',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.toUpperCase().trim())
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/, {
    message:
      'Placa deve estar no formato antigo (ABC1234) ou Mercosul (ABC1D23)',
  })
  placa: string;

  @ApiProperty({
    example: '9BWZZZ377NT004253',
    description: 'Número do Chassi (17 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.toUpperCase().trim())
  @Length(17, 17, { message: 'Chassi deve ter exatamente 17 caracteres' })
  chassi: string;

  @ApiProperty({
    example: '12345678901',
    description: 'Código Renavam (11 dígitos)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  @Length(11, 11, { message: 'Renavam deve ter exatamente 11 dígitos' })
  @Matches(/^[0-9]+$/, { message: 'Renavam deve conter apenas números' })
  renavam: string;

  @ApiProperty({ example: 'Corolla XEi', description: 'Modelo do veículo' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  modelo: string;

  @ApiProperty({ example: 'Toyota', description: 'Marca do veículo' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  marca: string;

  @ApiProperty({ example: 2024, description: 'Ano de fabricação' })
  @IsInt()
  @IsNotEmpty()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano: number;
}
