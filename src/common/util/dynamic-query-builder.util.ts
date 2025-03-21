import { SelectQueryBuilder } from 'typeorm';

/**
 * Las interfaces que definan la estructura de un filtro para una query deben heredar de esta interface
 */
export interface Filter {
  [x: string]: any;
}

/**
 * Esta funcion retorna un SelectQueryBuilder que consiste del objeto del mismo tipo recibido con el filtro incorporado
 * @param queryBuilder - Un objeto SelectQueryBuilder<T>
 * @param filterValue - Un valor de filtro para ser aplicado en el objeto query
 */
export type Condition<T> = (
  queryBuilder: SelectQueryBuilder<T>,
  filterValue: any
) => SelectQueryBuilder<T>;

/**
 * Representa un objeto clave Condicion donde la clave es el nombre del filtro
 */
export type Conditions<T> = Record<string, Condition<T>>;

export class DynamicQueryBuilder {
  /**
   * Construye una nueva query a partir de una query base, una serie de condiciones y un filtro con los valores (atributos del dto)
   * @param queryBuilderBase objeto SelectQueryBuilder<T> el que debe contener la sentenica basica de select de acuerdo a typeorm
   * @param conditions objeto clave Condition el cual contendra las condiciones opcionales de busqueda
   * @param filter objeto clave valor que contiene los campos a filtrar y su valor
   * @returns
   */
  static buildSelectQuery<T>(
    queryBuilderBase: SelectQueryBuilder<T>,
    conditions: Conditions<T>,
    filter: Filter
  ) {
    const query: SelectQueryBuilder<T> = Object.keys(filter) //obtiene los nombres de las keys de filter
      .filter((key) => filter[key] !== undefined) //filtra las keys, dejando únicamente aquellas keys cuyos valores que estén definidos
      .reduce((previous: SelectQueryBuilder<T>, current: string) => {
        const addCondition = conditions[current]; //obtiene la funcion condition que corresponde a la key
        if (addCondition) {
          return addCondition(previous, filter[current]); //ejecuta la condition
        }
        return previous;
      }, queryBuilderBase); //reduce retorna el query builder con las condiciones agregadas
    return query;
  }
}
