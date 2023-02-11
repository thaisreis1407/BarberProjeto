import { addMonths } from 'date-fns';

import { ConfigApi } from '../config/Constantes';
import api from './api';
import { BaseService } from './BaseService';

class DuplicataPagarService extends BaseService {
  constructor() {
    super(`${ConfigApi.DuplicataPagarURL}`);
  }

  getFilter(): Filter {
    return new Filter();
  }

  async quitar(idDuplicataPagar: number, body: any): Promise<any> {
    try {
      const response = await api.put(`duplicatasPagarQuitar/${idDuplicataPagar}`, body);
      return response.data;
    } finally {
      this.setLoading(false);
    }
  }
  async estornar(idDuplicataPagamento: number): Promise<any> {
    try {
      const response = await api.put(`duplicatasPagarEstornar/${idDuplicataPagamento}`);
      return response.data;
    } finally {
      this.setLoading(false);
    }
  }
}

class Filter {
  idConta: number;
  idFornecedor: number;
  dataInicio: Date;
  dataFim: Date;
  tipoPeriodo: number; // 0 - data compra, 1 data vencimento

  size: 9999;
  page: 0;

  constructor() {
    this.idConta = 0;
    this.idFornecedor = 0;
    this.dataInicio = addMonths(new Date(), -3);
    this.dataFim = new Date();
    this.tipoPeriodo = 0;

    this.size = 9999;
    this.page = 0;
  }
}
export default new DuplicataPagarService();
