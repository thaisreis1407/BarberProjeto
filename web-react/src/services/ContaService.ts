import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class ContaService extends BaseService {
  constructor() {
    super(`${ConfigApi.ContaURL}`);
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
export default new ContaService();
