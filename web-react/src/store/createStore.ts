/**
 * Módulo inicial para persistir e compartilhar dados com os componentes
 * @module Store
 * @category Redux
 */

import { legacy_createStore as createStore, applyMiddleware } from 'redux';

/**
 * Cria store
 * @param {any }reducers
 * @param {any} middlewares
 */
export default (reducers: any, middlewares: any): any => {
  const enhancer = applyMiddleware(...middlewares);
  return createStore(reducers, enhancer);
};
