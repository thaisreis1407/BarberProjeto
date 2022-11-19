import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class AtendenteService extends BaseService {
  constructor() {
    super(`${ConfigApi.AgendaURL}`);
  }

  getFilter(): Filter {
    return new Filter();
  }
}

class Filter {
  idMesa: number;
  limit: 9999;
  page: 0;

  constructor() {
    this.idMesa = 0;
    this.limit = 9999;
    this.page = 0;
  }
}
export default new AtendenteService();
