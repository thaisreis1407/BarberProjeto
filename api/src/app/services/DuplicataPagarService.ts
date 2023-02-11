/* eslint-disable no-param-reassign */
// import { Like } from 'typeorm';

import { StatusDupl } from '../../util/constants';
import NotFoundException from '../exceptions/NotFoundException';
import ValidationException from '../exceptions/ValidationException';
import { ContaModel } from '../models/ContaModel';
// import ValidationException from '../exceptions/ValidationException';
import { DuplicataPagamentoModel } from '../models/DuplicataPagamentoModel';
import { DuplicataPagarModel } from '../models/DuplicataPagarModel';
import { MovimentacaoContaModel } from '../models/MovimentacaoContaModel';
import { ViewDuplicataPagarModel } from '../models/views/ViewDuplicataModel';
import BaseService from './BaseService';
import MovimentacaoContaService from './MovimentacaoContaService';

interface IFiltroDuplicataPagar {
  id?: number;
  nome?: any;
}

class DuplicataPagarService extends BaseService<DuplicataPagarModel> {
  viewRepository =
    this.connection.getRepository<ViewDuplicataPagarModel>(ViewDuplicataPagarModel);

  duplicataPagamentoRepository =
    this.connection.getRepository<DuplicataPagamentoModel>(DuplicataPagamentoModel);

  constructor(nomeConexao = '') {
    super(nomeConexao, DuplicataPagarModel);
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

      const duplicataPagar = await this.repository.findOne(where, {
        relations: ['duplicataPagamento', 'fornecedor'],
      });
      if (duplicataPagar) {
        return duplicataPagar;
      }

      throw new NotFoundException();
    }

    return this.findAllPageable<ViewDuplicataPagarModel>(this.viewRepository, queryParams, {
      order: { id: 'ASC' },
    });

    // return this.findAllPageable<DuplicataPagarModel>(this.repository, queryParams, {
    //   order: { id: 'ASC' },
    //   relations: ['duplicataPagamento', 'fornecedor'],
    // });
  }

  async store(reqBody: DuplicataPagarModel): Promise<any> {
    const duplicataPagar = this.repository.create(reqBody);

    return this.repository.save(duplicataPagar);
  }

  async update(id: number, reqBody: DuplicataPagarModel): Promise<any> {
    const duplicataPagarExist = await this.repository.findOne(id || 0);
    if (!duplicataPagarExist) {
      throw new NotFoundException('DuplicataPagar não existe');
    }
    const duplicataPagar = this.repository.create(reqBody);
    duplicataPagar.id = id;

    return this.repository.save(duplicataPagar);
  }

  async quitar(id: number, reqBody: DuplicataPagamentoModel): Promise<any> {
    const duplicataPagarExist = await this.repository.findOne(id || 0, {
      relations: ['fornecedor'],
    });

    if (!duplicataPagarExist) {
      throw new NotFoundException('DuplicataPagar não existe');
    }
    const duplicataPagamento = this.duplicataPagamentoRepository.create(reqBody);
    duplicataPagamento.idDuplicataPagar = id;

    if (duplicataPagarExist.status === StatusDupl.QUITADA) {
      throw new ValidationException('Duplicata já está totalmente quitada');
    }

    if (
      duplicataPagarExist.valorRecebido + duplicataPagamento.valor ===
      duplicataPagarExist.valor
    ) {
      duplicataPagarExist.status = StatusDupl.QUITADA;
    } else if (
      duplicataPagarExist.valorRecebido + duplicataPagamento.valor >
      duplicataPagarExist.valor
    ) {
      throw new ValidationException('Valor ultrapassa ao valor a receber');
    } else {
      duplicataPagarExist.status = StatusDupl.PARCIAL;
    }

    duplicataPagarExist.valorRecebido += duplicataPagamento.valor;

    const movimentacaoConta = new MovimentacaoContaModel();

    movimentacaoConta.dataMovimentacao = duplicataPagamento.dataPagamento;
    movimentacaoConta.descricao = `Quitação de Dupl. Pagar Id: ${duplicataPagarExist.id}, Forn.: ${duplicataPagarExist.fornecedor.nome}`;

    movimentacaoConta.idConta = duplicataPagamento.idConta;
    const conta = new ContaModel();

    conta.id = duplicataPagamento.idConta;
    movimentacaoConta.conta = conta;
    movimentacaoConta.tipo = 'D';
    movimentacaoConta.valor = duplicataPagamento.valor;

    const movimentacaoContaService = new MovimentacaoContaService(this.nomeConexao);
    const movConta = await movimentacaoContaService.store(movimentacaoConta);

    duplicataPagamento.idMovimentacaoConta = movConta.id;
    await this.repository.save(duplicataPagarExist);

    return this.duplicataPagamentoRepository.save(duplicataPagamento);
  }

  async estornar(idPagamento: number): Promise<any> {
    const duplicataPagamentoExist = await this.duplicataPagamentoRepository.findOne(
      idPagamento || 0
    );

    if (!duplicataPagamentoExist) {
      throw new NotFoundException('Duplicata Pagamento não existe');
    }

    const duplicataPagar = await this.repository.findOne(
      duplicataPagamentoExist.idDuplicataPagar
    );

    if (!duplicataPagar) {
      throw new NotFoundException('Duplicata Pagar não existe');
    }

    duplicataPagar.valorRecebido -= duplicataPagamentoExist.valor;

    if (duplicataPagar.valorRecebido === 0) {
      duplicataPagar.status = StatusDupl.ABERTO;
    } else {
      duplicataPagar.status = StatusDupl.PARCIAL;
    }

    const movimentacaoContaService = new MovimentacaoContaService(this.nomeConexao);

    await this.repository.save(duplicataPagar);

    await this.duplicataPagamentoRepository.delete(duplicataPagamentoExist.id);

    await movimentacaoContaService.delete(duplicataPagamentoExist.idMovimentacaoConta);

    return idPagamento;
  }

  async delete(id: number): Promise<any> {
    const duplicataPagarExist = await this.repository.findOne(id || 0);
    if (!duplicataPagarExist) {
      throw new NotFoundException('DuplicataPagar não existe');
    }
    await this.repository.delete(id);
  }

  // override
  montaFiltro(queryParams: any): IFiltroDuplicataPagar {
    const retorno: IFiltroDuplicataPagar = {};

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
}

export default DuplicataPagarService;
