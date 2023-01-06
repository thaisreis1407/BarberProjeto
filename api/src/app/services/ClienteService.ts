/* eslint-disable no-param-reassign */
import { Like } from 'typeorm';
// import { Like } from 'typeorm';

import NotFoundException from '../exceptions/NotFoundException';
// import ValidationException from '../exceptions/ValidationException';
import { ClienteModel } from '../models/ClienteModel';
import BaseService from './BaseService';

interface IFiltroCliente {
  id?: number;
  nome?: any;
  telefone?: any;
  celular?: any;
}

class ClienteService extends BaseService<ClienteModel> {
  constructor(nomeConexao = '') {
    super(nomeConexao, ClienteModel);
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

      const cliente = await this.repository.findOne(where);
      if (cliente) {
        return cliente;
      }

      throw new NotFoundException();
    }

    const clientes = await this.findAllPageable<ClienteModel>(this.repository, queryParams, {
      order: { nome: 'ASC' },
    });

    return clientes;
  }

  async store(reqBody: ClienteModel): Promise<any> {
    const cliente = this.repository.create(reqBody);

    return this.repository.save(cliente);
  }

  async update(id: number, reqBody: ClienteModel): Promise<any> {
    const clienteExist = await this.repository.findOne(id || 0);
    if (!clienteExist) {
      throw new NotFoundException('Cliente não existe');
    }
    const cliente = this.repository.create(reqBody);
    cliente.id = id;

    return this.repository.save(cliente);
  }

  async delete(id: number): Promise<any> {
    const clienteExist = await this.repository.findOne(id || 0);
    if (!clienteExist) {
      throw new NotFoundException('Cliente não existe');
    }
    await this.repository.delete(id);
  }

  // override
  montaFiltro(queryParams: any): IFiltroCliente {
    const retorno: IFiltroCliente = {};

    if (queryParams) {
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }

      if (queryParams.nome) {
        retorno.nome = this.iLikeUnaccent(`${queryParams.nome}%`);
      }

      if (queryParams.telefone) {
        retorno.telefone = Like(`${queryParams.telefone}%`);
      }

      if (queryParams.celular) {
        retorno.celular = Like(`${queryParams.celular}%`);
      }
    }

    return retorno;
  }
}

export default ClienteService;
