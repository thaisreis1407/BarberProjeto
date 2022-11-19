import { ConfigApi } from '../config/Constantes';
import { BaseService } from './BaseService';

class ClienteService extends BaseService {
  constructor() {
    super(`${ConfigApi.ClienteURL}`);
  }

  getFilter(): Filter {
    return new Filter();
  }
}

class Filter {
  nome: string;
  telefone: string;
  celular: string;
  size: 9999;
  page: 0;

  constructor() {
    this.nome = '';
    this.telefone = '';
    this.celular = '';
    this.size = 9999;
    this.page = 0;
  }
}
export default new ClienteService();
