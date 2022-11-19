/* eslint-disable import/no-cycle */

/**
 * Módulo Saga que configura o redux-saga
 * @module Saga
 * @category Redux
 */

import { all } from 'redux-saga/effects';

import auth from './auth/saga';

/**
 * Cria root saga
 * @func
 */
export default function* rootSaga(): any {
  return yield all([auth]);
}
