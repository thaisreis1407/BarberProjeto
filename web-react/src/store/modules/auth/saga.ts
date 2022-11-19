/* eslint-disable no-throw-literal */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */

import { call, put, all, takeLatest } from 'redux-saga/effects';

// eslint-disable-next-line import/no-cycle

import api from '../../../services/api';
import { getDecodedToken, errorHandle } from '../../../util/functions';
import { hiddenDialogLogin } from '../dialog/actions';
import { loadingSuccess, loading } from '../global/actions';
import { loginSuccess } from './actions';
// eslint-disable-next-line import/no-cycle

interface IResponseGenerator {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: number;
  statusText?: string;
}

export function* doLogin({ payload, redirectTo }: any): any {
  yield put(loading());
  const { nome, senha } = payload;
  try {
    const authorization = Buffer.from('speedy:@speedy0-').toString('base64');
    const body = `username=${nome}&password=${senha}&grant_type=password`;

    const response: IResponseGenerator = yield call(api.post, 'oauth/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authorization}`,
      },
    });

    const { access_token, usuario } = response.data;

    const decodedToken: any = getDecodedToken(access_token);

    localStorage.setItem(
      'apiInfo',
      JSON.stringify({
        apiVersion: 1,
        versionText: '1',
        dateLastUpdate: new Date(),
      })
    );

    const usuarioLogado = {
      ...usuario,
      vendedorColaborador: decodedToken?.vendedorColaborador,
    };

    yield put(loginSuccess(access_token, decodedToken, usuarioLogado));
    yield put(loadingSuccess());
    yield put(hiddenDialogLogin());

    if (redirectTo && redirectTo !== '') {
      window.location = redirectTo; // força recarregar a pagina
    }
  } catch (err: any) {
    yield put(loadingSuccess());
    errorHandle(err);
  }
}
export function setToken({ payload }: any): any {
  if (!payload) return;
  const { token, decodedToken } = payload.auth;

  if (decodedToken) {
    api.defaults.headers.common.id_dispositivo = `DISP_${decodedToken.user_name}`;
  }
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export function doLogout(): any {
  setTimeout(() => (window.location.href = '/login'), 400);
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/LOGIN_REQUEST', doLogin),
  takeLatest('@auth/LOGOUT', doLogout),
]);
