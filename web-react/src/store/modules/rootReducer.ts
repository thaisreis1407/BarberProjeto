/**
 * Módulo Saga que configura o redux-saga
 * @module Reducers
 * @category Redux
 */

import { combineReducers } from 'redux';

import auth from './auth/reducer';
import dialog from './dialog/reducer';
import global from './global/reducer';

export default combineReducers({
  auth,
  global,
  dialog,
});
