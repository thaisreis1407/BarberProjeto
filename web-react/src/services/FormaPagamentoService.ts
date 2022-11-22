import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class FormaPagamentoService extends BaseService {
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
  size: 9999;
  page: 0;

  constructor() {
    this.id = 0;
    this.descricao = '';
    this.size = 9999;
    this.page = 0;
  }
}
export default new FormaPagamentoService();
