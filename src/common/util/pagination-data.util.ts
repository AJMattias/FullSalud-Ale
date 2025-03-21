/**
 * Tipo para la metadata de la paginación
 */
export type PaginationMetadata = {
  totalPages: number;
  currentPage: number;
  previousPage: number;
  nextPage: number;
  totalItems: number;
};

/**
 * Calcula la información de paginación, como el total de páginas, página actual, página anterior y
 * siguiente, basado en los datos de entrada, número de página y límite.
 * @param data - Array de datos que se desea paginar.
 * @param page - Número de la página actual para la cual se desea obtener la información.
 * @param limit - Número de elementos a mostrar por página en la lista paginada.
 * @returns Un objeto con propiedades: `totalPages`, `currentPage`, `previousPage`, `nextPage`, y `totalItems`.
 */

export const getPagingData = (
  data: any[],
  page: number,
  limit: number
): PaginationMetadata => {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const previousPage = page > 1 ? page - 1 : null;

  return { totalPages, currentPage: page, previousPage, nextPage, totalItems };
};
