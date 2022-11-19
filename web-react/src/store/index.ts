/* eslint-disable import/no-cycle */

/**
 * Módulo inicial para persistir e compartilhar dados com os componentes
 * @module Redux
 * @category Redux
 */

import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import createStore from './createStore';
import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';
import persistReducers from './persistReducers';

// const sagaMonitor =
//   process.env.NODE_ENV === 'development' ? console.tron.createSagaMonitor() : undefined;

const sagaMonitor = undefined;

const sagaMiddleware = createSagaMiddleware({
  sagaMonitor,
});

const middlewares = [sagaMiddleware];

/**
 * Cria o store persist reducers
 */
const store = createStore(persistReducers(rootReducer), middlewares);

/**
 * Cria o persistor recebendo o store
 */
const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

export { store, persistor };
