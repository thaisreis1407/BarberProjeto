import { store } from '../store';
import { loading, loadingSuccess } from '../store/modules/global/actions';
import { geraFiltroHttp } from '../util/functions';
import api from './api';

export class BaseService {
  url = '';

  constructor(urlService: string) {
    this.url = urlService;
  }

  setLoading(value: boolean): void {
    if (value) {
      store.dispatch(loading());
    } else {
      store.dispatch(loadingSuccess());
    }
  }

  async consulta(filter: any): Promise<any> {
    this.setLoading(true);
    try {
      const filterGet = geraFiltroHttp(filter);
      const response = await api.get(`${this.url}${filterGet}`);
      return response.data;
    } finally {
      this.setLoading(false);
    }
  }

  async buscaPorId(id: number): Promise<any> {
    this.setLoading(true);
    try {
      const response = await api.get(`${this.url}/${id}`);
      return response.data;
    } finally {
      this.setLoading(false);
    }
  }

  async adicionar(body: any): Promise<any> {
    delete body.id;
    this.setLoading(true);
    try {
      const response = await api.post(this.url, body);
      return response.data;
    } finally {
      this.setLoading(false);
    }
  }

  async atualizar(body: any): Promise<any> {
    try {
      const response = await api.put(`${this.url}/${body.id}`, body);
      return response.data;
    } finally {
      this.setLoading(false);
    }
  }

  async delete(id: number): Promise<any> {
    try {
      await api.delete(`${this.url}/${id}`);
    } finally {
      this.setLoading(false);
    }
  }
}
