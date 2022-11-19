/**
 * Serviço que gerencia informações da API
 * @module ApiInfo
 * @category Serviços
 */

import { getApiInfo, checkVersaoApi as apiCheckVersaoApi } from './api';

/**
 * @augments BaseService
 */
class ApiInfoService {
  /**
   * Busca informações da API
   * @returns {Promise<any>} Objeto contendo informações da API
   */
  async apiInfo(): Promise<any> {
    return getApiInfo();
  }

  /**
   * Verifica se a versão da plataforma web está de acordo com a versão da API
   * @async
   * @returns {Promise<boolean>}
   */
  async checkVersaoApi(): Promise<boolean> {
    return apiCheckVersaoApi();
  }
}

export default new ApiInfoService();
