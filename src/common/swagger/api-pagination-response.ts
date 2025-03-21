import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiPaginationResponse = (entity: any) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Successful request',
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(entity) }
          },
          meta: {
            type: 'object',
            //totalPages, currentPage: page, previousPage, nextPage, totalItems
            properties: {
              totalPages: { type: 'number' },
              currentPage: { type: 'number' },
              previousPage: { type: 'number' },
              nextPage: { type: 'number' },
              totalItems: { type: 'number' }
            }
          }
        }
      }
    })
  );
};
