import { ApiResponseOptions } from '@nestjs/swagger';

const vehicleDataSchema = {
  type: 'object',
  properties: {
    id: { type: 'number', example: 1, description: 'Identificador do veículo' },
    placa: { type: 'string', example: 'ABC1D23' },
    chassi: {
      type: 'string',
      example: '9BWZZZ377NT004253',
      description: 'Número do chassi',
    },
    renavam: { type: 'string', example: '12345678901' },
    modelo: { type: 'string', example: 'Corolla XEi' },
    marca: { type: 'string', example: 'Toyota' },
    ano: { type: 'number', example: 2024 },
  },
};

export const createResponse: ApiResponseOptions = {
  status: 201,
  description: 'Veículo criado com sucesso.',
  schema: vehicleDataSchema,
};

export const findAllResponse: ApiResponseOptions = {
  status: 200,
  description: 'Lista paginada de veículos retornada com sucesso.',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: vehicleDataSchema,
      },
      meta: {
        type: 'object',
        properties: {
          total: {
            type: 'number',
            example: 100,
            description: 'Total de registros',
          },
          page: {
            type: 'number',
            example: 1,
            description: 'Página atual',
          },
          limit: {
            type: 'number',
            example: 10,
            description: 'Itens por página',
          },
          totalPages: {
            type: 'number',
            example: 10,
            description: 'Total de páginas',
          },
        },
      },
    },
  },
};

export const findOneResponse: ApiResponseOptions = {
  status: 200,
  description: 'Veículo encontrado com sucesso.',
  schema: vehicleDataSchema,
};

export const updateResponse: ApiResponseOptions = {
  status: 200,
  description: 'Veículo atualizado com sucesso.',
  schema: vehicleDataSchema,
};

export const removeResponse: ApiResponseOptions = {
  status: 200,
  description: 'Veículo removido com sucesso.',
  schema: vehicleDataSchema,
};
