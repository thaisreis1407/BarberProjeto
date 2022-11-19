/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */

/**
 * Serviço que gerencia Usuario
 * @module Usuario
 * @category Serviços
 */

import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class UsuarioService extends BaseService {
  constructor() {
    super(`${ConfigApi.UsuarioURL}`);
  }

  /**
   * Retorna o objeto filter específico do serviço
   * @returns {Filter}
   */
  getFilter(): Filter {
    return new Filter();
  }
}

/**
 * Objeto filtro do serviço do Usuario
 * @class
 */
class Filter {
  login?: string;

  idColaborador?: number;
  senha?: string;
  inativo: boolean;
  limit: 9999;
  page: 0;

  constructor() {
    this.login = '';
    this.idColaborador = 0;
    this.inativo = false;
    this.limit = 9999;
    this.page = 0;
  }
}
export default new UsuarioService();
