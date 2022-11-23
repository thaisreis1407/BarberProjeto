import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class FornecedorService extends BaseService {
  constructor() {
    super(`${ConfigApi.FornecedorURL}`);
  }

  getFilter(): Filter {
    return new Filter();
  }
}

class Filter {
  id: number;
  nome: string;
  size: 9999;
  page: 0;

  constructor() {
    this.id = 0;
    this.nome = '';
    this.size = 9999;
    this.page = 0;
  }
}
export default new FornecedorService();
