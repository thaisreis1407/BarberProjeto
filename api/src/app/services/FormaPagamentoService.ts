/* eslint-disable no-param-reassign */

import NotFoundException from '../exceptions/NotFoundException';
// import ValidationException from '../exceptions/ValidationException';
import { FormaPagamentoModel } from '../models/FormaPagamentoModel';
import { ViewFormaPagamentoModel } from '../models/views/ViewFormaPagamentoModel';
import BaseService from './BaseService';

interface IFiltroFormaPagamento {
  id?: number;
  descricao?: any;
}

class FormaPagamentoService extends BaseService<FormaPagamentoModel> {
  viewRepository =
    this.connection.getRepository<ViewFormaPagamentoModel>(ViewFormaPagamentoModel);
  constructor(nomeConexao = '') {
    super(nomeConexao, FormaPagamentoModel);
  }

  // override
  public carregaConexao(nomeConexao: string): void {
    super.carregaConexao(nomeConexao);
  }

  async index(reqParams: any, queryParams: any): Promise<any> {
    if (reqParams.id) {
      const where = {
        id: reqParams.id,
      };

      const formaPagamento = await this.repository.findOne(where, { relations: ['conta'] });
      if (formaPagamento) {
        return formaPagamento;
      }

      throw new NotFoundException();
    }

    if (queryParams.resumo === '') {
      return this.findAllPageable<ViewFormaPagamentoModel>(this.viewRepository, queryParams, {
        order: { id: 'ASC' },
      });
    }
    return this.findAllPageable<FormaPagamentoModel>(this.repository, queryParams, {
      order: { id: 'ASC' },
      relations: ['conta'],
    });
  }

  async store(reqBody: FormaPagamentoModel): Promise<any> {
    const formaPagamento = this.repository.create(reqBody);

    if (formaPagamento.padrao) {
      await this.repository.update({ padrao: true }, { padrao: false });
    }

    return this.repository.save(formaPagamento);
  }

  async update(id: number, reqBody: FormaPagamentoModel): Promise<any> {
    const formaPagamentoExist = await this.repository.findOne(id || 0);
    if (!formaPagamentoExist) {
      throw new NotFoundException('Forma de Pagamento não existe');
    }
    const formaPagamento = this.repository.create(reqBody);
    formaPagamento.id = id;

    if (formaPagamento.padrao) {
      await this.repository.update({ padrao: true }, { padrao: false });
    }

    return this.repository.save(formaPagamento);
  }

  async delete(id: number): Promise<any> {
    const formaPagamentoExist = await this.repository.findOne(id || 0);
    if (!formaPagamentoExist) {
      throw new NotFoundException('Forma de Pagamento não existe');
    }
    await this.repository.delete(id);
  }

  // override
  montaFiltro(queryParams: any): IFiltroFormaPagamento {
    const retorno: IFiltroFormaPagamento = {};

    if (queryParams) {
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }

      if (queryParams.descricao) {
        retorno.descricao = this.iLikeUnaccent(`${queryParams.descricao}%`);
      }
    }

    return retorno;
  }
}

export default FormaPagamentoService;
