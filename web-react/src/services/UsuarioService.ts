/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */

import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class UsuarioService extends BaseService {
  constructor() {
    super(`${ConfigApi.UsuarioURL}`);
  }

  getFilter(): Filter {
    return new Filter();
  }
}

class Filter {
  login?: string;

  perfil?: string;
  size: 9999;
  page: 0;

  constructor() {
    this.login = '';
    this.perfil = '';
    this.size = 9999;
    this.page = 0;
  }
}
export default new UsuarioService();
