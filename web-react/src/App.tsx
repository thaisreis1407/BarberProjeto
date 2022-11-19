/* eslint-disable import-helpers/order-imports */
/* eslint-disable func-names */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-extend-native */

import React from 'react';

// import 'primereact/resources/themes/nova/theme.css'; // theme
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

import 'react-toastify/dist/ReactToastify.css';

import './styles/prime-react.scss';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

// import LookupGeneric from './components/LookupGeneric';
import MessageDialog from './components/MessageDialog';

import Routes from './routes';

import { store, persistor } from './store';
import GlobalStyle from './styles/global';
import DisplayBlock from './components/DisplayBlock';

/**
 * Componente App inicial da aplicação
 * @func
 */
function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <DisplayBlock paddingLeftIcon={0} />
          <Routes />
          <GlobalStyle />
          <MessageDialog />

          {/* <LookupGeneric /> */}
          <ToastContainer autoClose={2500} />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
