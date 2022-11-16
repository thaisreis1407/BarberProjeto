/* eslint-disable no-param-reassign */
import { Like, Repository } from 'typeorm';
// import { Like } from 'typeorm';

import NotFoundException from '../exceptions/NotFoundException';
// import ValidationException from '../exceptions/ValidationException';
import { FornecedorModel } from '../models/FornecedorModel';
import BaseService from './BaseService';

interface IFiltroFornecedor {
  id?: number;
  descricao?: any;
}

class FornecedorService extends BaseService<FornecedorModel> {
  constructor(nomeConexao = '') {
    super(nomeConexao, FornecedorModel);
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

      const fornecedor = await this.repository.findOne(where);
      if (fornecedor) {
        return fornecedor;
      }

      throw new NotFoundException();
    }

    const fornecedors = await this.findAllPageable<FornecedorModel>(this.repository, queryParams, {
      order: { id: 'ASC' },
    });

    return fornecedors;
  }

  async store(reqBody: FornecedorModel): Promise<any> {
    const fornecedor = this.repository.create(reqBody);

    return this.repository.save(fornecedor);
  }

  async update(id: number, reqBody: FornecedorModel): Promise<any> {
    const fornecedorExist = await this.repository.findOne(id || 0);
    if (!fornecedorExist) {
      throw new NotFoundException('Fornecedor não existe');
    }
    const fornecedor = this.repository.create(reqBody);
    fornecedor.id = id;

    return this.repository.save(fornecedor);
  }


  async delete(id: number): Promise<any> {
    const fornecedorExist = await this.repository.findOne(id || 0);
    if (!fornecedorExist) {
      throw new NotFoundException('Fornecedor não existe');
    }
    await this.repository.delete(id);
  }


  // override
  montaFiltro(queryParams: any): IFiltroFornecedor {
    const retorno: IFiltroFornecedor = {};

    if (queryParams) {
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }

      if (queryParams.descricao) {
        retorno.descricao = Like(`${queryParams.descricao}%`);
      }
    }

    return retorno;
  }
}

export default FornecedorService;
