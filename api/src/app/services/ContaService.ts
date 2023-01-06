/* eslint-disable no-param-reassign */

import NotFoundException from '../exceptions/NotFoundException';
// import ValidationException from '../exceptions/ValidationException';
import { ContaModel } from '../models/ContaModel';
import BaseService from './BaseService';

// Criando quais filtros terei
interface IFiltroConta {
  id?: number;
  descricao?: any;
}

// Crio uma conexão para Conta
class ContaService extends BaseService<ContaModel> {
  constructor(nomeConexao = '') {
    super(nomeConexao, ContaModel);
  }

  // Carreguei conexão
  // override
  public carregaConexao(nomeConexao: string): void {
    super.carregaConexao(nomeConexao);
  }

  //
  async index(reqParams: any, queryParams: any): Promise<any> {
    if (reqParams.id) {
      const where = {
        id: reqParams.id,
      };

      const conta = await this.repository.findOne(where);
      if (conta) {
        return conta;
      }

      throw new NotFoundException();
    }

    const contas = await this.findAllPageable<ContaModel>(this.repository, queryParams, {
      order: { id: 'ASC' },
    });

    return contas;
  }

  //
  async store(reqBody: ContaModel): Promise<any> {
    const conta = this.repository.create(reqBody);

    return this.repository.save(conta);
  }

  // atualizar registro entendido
  async update(id: number, reqBody: ContaModel): Promise<any> {
    const contaExist = await this.repository.findOne(id || 0);
    if (!contaExist) {
      throw new NotFoundException('Conta não existe');
    }
    const conta = this.repository.create(reqBody);
    conta.id = id;

    return this.repository.save(conta);
  }

  // deletar registro entendido
  async delete(id: number): Promise<any> {
    const contaExist = await this.repository.findOne(id || 0);
    if (!contaExist) {
      throw new NotFoundException('Conta não existe');
    }
    await this.repository.delete(id);
  }

  // Montando filtro para usar no consulta duvida?
  // override
  montaFiltro(queryParams: any): IFiltroConta {
    // any estou indo mandar qualquer coisa
    // IFiltroConta, tem que esta declarado, para saber o que posso retornar
    // duvida do que esta ocorrendo na linha "const retorno: IFiltroConta = {};"
    const retorno: IFiltroConta = {};
    // olhando se existir algum Parametro
    if (queryParams) {
      // olhar se vai ser id ou descrição o que esta mandando pra buscar
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }
      // Como eu retorno todo o registro sendo que o retorno é somente os campos
      if (queryParams.descricao) {
        retorno.descricao = this.iLikeUnaccent(`${queryParams.descricao}%`);
      }
    }
    return retorno;
  }
}

export default ContaService;
