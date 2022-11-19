/**
 * Módulo inicial para persistir e compartilhar dados com os componentes
 * @module PersistReducers
 * @category Redux
 */

import { persistReducer } from 'redux-persist';
import session from 'redux-persist/lib/storage/session';

/**
 * Cria um persisteReducer
 * @param {any} reducers
 * @return {Reducer<any, action<any>>}
 */
export default (reducers: any): any => {
  const persistedReducer = persistReducer(
    {
      key: 'speedy',
      storage: session,
      whitelist: ['auth'],
    },
    reducers
  );
  return persistedReducer;
};
