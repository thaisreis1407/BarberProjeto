import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class FornaPagamentoService extends BaseService {
  constructor() {
    super(`${ConfigApi.FormaPagamentoURL}`);
  }

  getFilter(): Filter {
    return new Filter();
  }
}

class Filter {
  id: number;
  descricao: string;
  limit: 9999;
  page: 0;

  constructor() {
    this.id = 0;
    this.descricao = '';
    this.limit = 9999;
    this.page = 0;
  }
}
export default new FornaPagamentoService();
