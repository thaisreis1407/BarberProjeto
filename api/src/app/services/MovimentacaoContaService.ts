/* eslint-disable no-param-reassign */
// import { Like } from 'typeorm';

import NotFoundException from '../exceptions/NotFoundException';
// import ValidationException from '../exceptions/ValidationException';
import { ContaModel } from '../models/ContaModel';
import { MovimentacaoContaModel } from '../models/MovimentacaoContaModel';
import { ViewMovimentacaoContaModel } from '../models/views/ViewMovimentacaoContaModel';
import BaseService from './BaseService';

interface IFiltroMovimentacaoConta {
  id?: number;
  nome?: any;
}

class MovimentacaoContaService extends BaseService<MovimentacaoContaModel> {
  viewRepository = this.connection.getRepository<ViewMovimentacaoContaModel>(
    ViewMovimentacaoContaModel
  );
  constructor(nomeConexao = '') {
    super(nomeConexao, MovimentacaoContaModel);
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

      const movimentacaoConta = await this.repository.findOne(where, { relations: ['conta'] });
      if (movimentacaoConta) {
        return movimentacaoConta;
      }

      throw new NotFoundException();
    }

    if (queryParams.resumo === '') {
      return this.findAllPageable<ViewMovimentacaoContaModel>(
        this.viewRepository,
        queryParams,
        {
          order: { id: 'ASC' },
        }
      );
    }

    return this.findAllPageable<MovimentacaoContaModel>(this.repository, queryParams, {
      order: { id: 'ASC' },
      relations: ['conta'],
    });
  }

  async store(reqBody: MovimentacaoContaModel): Promise<any> {
    const movimentacaoConta = this.repository.create(reqBody);

    let valorAjustar = 0;
    if (movimentacaoConta.tipo === 'C') {
      valorAjustar = 0;
      valorAjustar = movimentacaoConta.valor;
    } else {
      valorAjustar = movimentacaoConta.valor * - 1;
    }
    await this.atualizaSaldoConta(movimentacaoConta.conta.id, valorAjustar);
    return this.repository.save(movimentacaoConta);
  }

  async update(id: number, reqBody: MovimentacaoContaModel): Promise<any> {
    const movimentacaoContaExist = await this.repository.findOne(id || 0);
    if (!movimentacaoContaExist) {
      throw new NotFoundException('Movimentação não existe');
    }
    const movimentacaoConta = this.repository.create(reqBody);
    const valorExiste = movimentacaoContaExist.valor || 0;
    const valorAtual = movimentacaoConta.valor || 0;

    movimentacaoConta.id = id;

    let valorAjustar = 0;
    if (movimentacaoConta.tipo === 'C') {
      valorAjustar = valorAtual - valorExiste;
    } else {
      valorAjustar = (valorAtual - valorExiste) * -1;
    }

    await this.atualizaSaldoConta(movimentacaoConta.conta.id, valorAjustar);

    return this.repository.save(movimentacaoConta);
  }

  async delete(id: number): Promise<any> {
    const movimentacaoContaExist = await this.repository.findOne(id || 0);
    if (!movimentacaoContaExist) {
      throw new NotFoundException('Movimentação de conta não existe');
    }
    let valorAjustar = 0;
    if (movimentacaoContaExist.tipo === 'C') {
      valorAjustar = movimentacaoContaExist.valor * -1;
    } else {
      valorAjustar = movimentacaoContaExist.valor;
    }

    await this.atualizaSaldoConta(movimentacaoContaExist.idConta, valorAjustar);
    await this.repository.delete(id);
  }

  // override
  montaFiltro(queryParams: any): IFiltroMovimentacaoConta {
    const retorno: IFiltroMovimentacaoConta = {};

    if (queryParams) {
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }

      if (queryParams.nome) {
        retorno.nome = this.iLikeUnaccent(`${queryParams.nome}%`);
      }
    }

    return retorno;
  }

  async atualizaSaldoConta(idConta: number, saldoAjustar: number): Promise<void> {
    if (saldoAjustar !== 0) {
      const repositoryContaServico = this.connection.getRepository(ContaModel);
      const contaServico = await repositoryContaServico.findOne(idConta);
      if (contaServico) {
        const saldoAtual = contaServico.saldo || 0;
        contaServico.saldo = saldoAtual + saldoAjustar;
        await repositoryContaServico.save(contaServico);
      }
    }
  }
}

export default MovimentacaoContaService;
