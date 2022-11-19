/* eslint-disable no-use-before-define */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable import/no-cycle */

import axios from 'axios';
import { differenceInMinutes } from 'date-fns';
import jwt from 'jsonwebtoken';

import authConfig from '../config/auth';
import { ConfigApi } from '../config/Constantes';
import { store } from '../store';
import { logout } from '../store/modules/auth/actions';

const api = axios.create({
  baseURL: ConfigApi.baseURL,
});

// configurando a api
api.interceptors.request.use(
  (config: any) => {
    const { Authorization } = config.headers;
    const { url } = config;
    if (Authorization && url !== 'oauth/token') {
      const token = Authorization.split(' ')[1];
      if (token && !checkToken(token)) {
        return Promise.reject({ tokenExpired: true });
      }

      if (url !== 'apiInfo') {
        checkApi();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Verifica se o token é válido
 * @param {string} token
 * @returns True se token for válido
 */
function checkToken(token: string): boolean {
  try {
    jwt.verify(token, authConfig.secret);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Obtem a informações como versão da API
 * @returns Objeto contendo informações da API
 */
export async function getApiInfo(): Promise<any> {
  try {
    const response = await api.get(`${ConfigApi.apiInfoURL}`);
    return response.data;
  } catch (err) {
    return null;
  }
}

/**
 * Checa a versão da API retornando true se a versão for compatível com a versão do front-end
 * @returns {boolean}
 */
export async function checkVersaoApi(): Promise<boolean> {
  let retorno = true;

  try {
    const dataAtual = new Date();

    // const versaoApi = Number(localStorage.getItem('apiVersion') || '0');
    // const dataUltimaVersao = localStorage.getItem('dateLastUpdate');
    const apiInfo = JSON.parse(localStorage.getItem('apiInfo') || '');
    const dataUltimaVersao = apiInfo && apiInfo.dateLastUpdate ? apiInfo.dateLastUpdate : null;
    const versaoApi = Number(apiInfo ? apiInfo.apiVersion : '0');
    const versaoTextApi = apiInfo && apiInfo.version ? apiInfo.version : '';

    let versao = versaoApi;
    let versaoText = versaoTextApi;
    let atualizarApiInfo = false;
    const ultimaData =
      new Date(dataUltimaVersao).toString() !== 'Invalid Date'
        ? new Date(dataUltimaVersao)
        : null;

    if (!ultimaData || Math.abs(differenceInMinutes(ultimaData, dataAtual)) >= 1) {
      const data = await getApiInfo();

      versao = data.versionNumber;
      versaoText = data.version;
      atualizarApiInfo = true;
    }

    if (versaoApi !== versao) {
      atualizarApiInfo = true;
      retorno = false;
    }
    if (atualizarApiInfo) {
      localStorage.setItem(
        'apiInfo',
        JSON.stringify({
          apiVersion: versao,
          versionText: versaoText,
          dateLastUpdate: dataAtual,
        })
      );
    }
  } catch (err) {
    // toast.error('Não foi possível obter versão da API');
  }

  return retorno;
}

/**
 * Checa versão da API, e se existir uma nova versão a plataforma é direcionada ao login
 */
export async function checkApi(): Promise<void> {
  const check = await checkVersaoApi();

  if (!check) {
    // window.location = '/login';
    store.dispatch(logout());
  }
}

export default api;
