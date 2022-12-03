import { ConfigApi } from '../config/Constantes';
import { geraFiltroHttp } from '../util/functions';
import api from './api';
import { BaseService } from './BaseService';

class AgendamentoService extends BaseService {
  constructor() {
    super(`${ConfigApi.AgendamentoURL}`);
  }

  getFilter(): Filter {
    return new Filter();
  }

  async abrirAtendimento(id: number): Promise<any> {
    this.setLoading(true);
    try {
      const response = await api.put(`${this.url}/${id}/abrirAtendimento`, {});
      return response.data;
    } finally {
      this.setLoading(false);
    }
  }

  async excluirAtendimento(id: number): Promise<any> {
    this.setLoading(true);
    try {
      const response = await api.put(`${this.url}/${id}/abrirAtendimento`, {});
      return response.data;
    } finally {
      this.setLoading(false);
    }
  }

  async consultarPorData(data: Date): Promise<any> {
    this.setLoading(true);
    try {
      const filterGet = geraFiltroHttp({ data });
      const response = await api.get(`${this.url}${filterGet}`);
      return response.data;
    } finally {
      this.setLoading(false);
    }
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
export default new AgendamentoService();
