import { Like } from 'typeorm';

/* eslint-disable no-param-reassign */
// import { Like } from 'typeorm';

import NotFoundException from '../exceptions/NotFoundException';
// import ValidationException from '../exceptions/ValidationException';
import { EntradaModel } from '../models/EntradaModel';
import { ViewEntradaModel } from '../models/views/ViewEntradaModel';
import BaseService from './BaseService';
import ProdutoServicoService from './ProdutoServicoService';

interface IFiltroEntrada {
  id?: number;
  nome?: any;
}

class EntradaService extends BaseService<EntradaModel> {
  viewRepository = this.connection.getRepository<ViewEntradaModel>(ViewEntradaModel);
  nomeConexao: string;
  constructor(nomeConexao = '') {
    super(nomeConexao, EntradaModel);
    this.nomeConexao = nomeConexao;
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

      const entrada = await this.repository.findOne(where, { relations: ['produtoServico'] });
      if (entrada) {
        return entrada;
      }

      throw new NotFoundException();
    }

    if (queryParams.resumo === '') {
      return this.findAllPageable<ViewEntradaModel>(this.viewRepository, queryParams, {
        order: { id: 'ASC' },
      });
    }

    return this.findAllPageable<EntradaModel>(this.repository, queryParams, {
      order: { id: 'ASC' },
      relations: ['produtoServico'],
    });
  }

  async store(reqBody: EntradaModel): Promise<any> {
    const entrada = this.repository.create(reqBody);

    await this.atualizaEstoque(entrada.produtoServico.id, entrada.quantidade);
    return this.repository.save(entrada);
  }

  async update(id: number, reqBody: EntradaModel): Promise<any> {
    const entradaExist = await this.repository.findOne(id || 0);
    if (!entradaExist) {
      throw new NotFoundException('Entrada não existe');
    }
    const entrada = this.repository.create(reqBody);
    const saldoNotaExiste = entradaExist.quantidade || 0;
    const saldoNotaAtual = entrada.quantidade || 0;

    entrada.id = id;
    await this.atualizaEstoque(entrada.produtoServico.id, saldoNotaAtual - saldoNotaExiste);

    return this.repository.save(entrada);
  }

  async delete(id: number): Promise<any> {
    const entradaExist = await this.repository.findOne(id || 0);
    if (!entradaExist) {
      throw new NotFoundException('Entrada não existe');
    }
    await this.atualizaEstoque(entradaExist.id, entradaExist.quantidade * -1);
    await this.repository.delete(id);
  }

  // override
  montaFiltro(queryParams: any): IFiltroEntrada {
    const retorno: IFiltroEntrada = {};

    if (queryParams) {
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }

      if (queryParams.nome) {
        retorno.nome = Like(`${queryParams.nome}%`);
      }
    }

    return retorno;
  }

  async atualizaEstoque(idProduto: number, quantAjustar: number): Promise<void> {
    const produtoService = new ProdutoServicoService(this.nomeConexao);
    await produtoService.atualizaEstoque(idProduto, quantAjustar);
  }
}

export default EntradaService;
