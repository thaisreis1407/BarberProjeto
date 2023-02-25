import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class EntradaService extends BaseService {
  constructor() {
    super(`${ConfigApi.EntradaURL}`);
  }

  getFilter(): Filter {
    return new Filter();
  }
}

class Filter {
  nome: string;
  size: 9999;
  page: 0;

  constructor() {
    this.nome = '';
    this.size = 9999;
    this.page = 0;
  }
}
export default new EntradaService();
