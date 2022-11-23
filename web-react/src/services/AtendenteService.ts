import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class AtendenteService extends BaseService {
  constructor() {
    super(`${ConfigApi.AtendenteURL}`);
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
    this.size = 9999;
    this.nome = '';
    this.page = 0;
  }
}
export default new AtendenteService();
