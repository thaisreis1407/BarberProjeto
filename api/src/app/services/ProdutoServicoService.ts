/* eslint-disable no-param-reassign */
import { Like } from 'typeorm';
// import { Like } from 'typeorm';

import NotFoundException from '../exceptions/NotFoundException';
// import ValidationException from '../exceptions/ValidationException';
import { ProdutoServicoModel } from '../models/ProdutoServicoModel';
import BaseService from './BaseService';

interface IFiltroProdutoServico {
  id?: number;
  nome?: any;
  bloqueado?: any;
  tipo?: any;
}

class ProdutoServicoService extends BaseService<ProdutoServicoModel> {
  constructor(nomeConexao = '') {
    super(nomeConexao, ProdutoServicoModel);
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

      const produtoServico = await this.repository.findOne(where);
      if (produtoServico) {
        return produtoServico;
      }

      throw new NotFoundException();
    }

    const produtoServicos = await this.findAllPageable<ProdutoServicoModel>(
      this.repository,
      queryParams,
      {
        order: { id: 'ASC' },
      }
    );

    return produtoServicos;
  }

  async store(reqBody: ProdutoServicoModel): Promise<any> {
    const produtoServico = this.repository.create(reqBody);

    return this.repository.save(produtoServico);
  }

  async update(id: number, reqBody: ProdutoServicoModel): Promise<any> {
    const produtoServicoExist = await this.repository.findOne(id || 0);
    if (!produtoServicoExist) {
      throw new NotFoundException('Forma de Pagamento não existe');
    }
    const produtoServico = this.repository.create(reqBody);
    produtoServico.id = id;

    return this.repository.save(produtoServico);
  }

  async delete(id: number): Promise<any> {
    const produtoServicoExist = await this.repository.findOne(id || 0);
    if (!produtoServicoExist) {
      throw new NotFoundException('Forma de Pagamento não existe');
    }
    await this.repository.delete(id);
  }

  async atualizaEstoque(idProduto: number, quantAjustar: number): Promise<void> {
    if (idProduto && quantAjustar !== 0) {
      const repositoryProdutoServico = this.connection.getRepository(ProdutoServicoModel);
      const produtoServico = await repositoryProdutoServico.findOne(idProduto);
      if (produtoServico) {
        const saldoAtual = produtoServico.saldo || 0;
        produtoServico.saldo = saldoAtual + quantAjustar;
        await repositoryProdutoServico.save(produtoServico);
      }
    }
  }

  // override
  montaFiltro(queryParams: any): IFiltroProdutoServico {
    const retorno: IFiltroProdutoServico = {};

    if (queryParams) {
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }

      if (queryParams.nome) {
        retorno.nome = Like(`${queryParams.nome}%`);
      }

      if (queryParams.bloqueado) {
        retorno.bloqueado = Like(`${queryParams.bloqueado}%`);
      }

      if (queryParams.tipo) {
        retorno.tipo = queryParams.tipo;
      }
    }
    return retorno;
  }
}

export default ProdutoServicoService;
