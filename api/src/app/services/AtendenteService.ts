/* eslint-disable no-param-reassign */

// import { Like } from 'typeorm';

import NotFoundException from '../exceptions/NotFoundException';
// import ValidationException from '../exceptions/ValidationException';
import { AtendenteModel } from '../models/AtendenteModel';
import { ViewAtendenteModel } from '../models/views/ViewAtendenteModel';
import BaseService from './BaseService';

interface IFiltroAtendente {
  id?: number;
  nome?: any;
}

class AtendenteService extends BaseService<AtendenteModel> {
  viewRepository = this.connection.getRepository<ViewAtendenteModel>(ViewAtendenteModel);
  constructor(nomeConexao = '') {
    super(nomeConexao, AtendenteModel);
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

      const atendente = await this.repository.findOne(where, { relations: ['conta'] });
      if (atendente) {
        return atendente;
      }

      throw new NotFoundException();
    }

    if (queryParams.resumo === '') {
      return this.findAllPageable<ViewAtendenteModel>(this.viewRepository, queryParams, {
        order: { id: 'ASC' },
      });
    }
    return this.findAllPageable<AtendenteModel>(this.repository, queryParams, {
      order: { id: 'ASC' },
      relations: ['conta'],
    });
  }

  async store(reqBody: AtendenteModel): Promise<any> {
    const atendente = this.repository.create(reqBody);

    return this.repository.save(atendente);
  }

  async update(id: number, reqBody: AtendenteModel): Promise<any> {
    const atendenteExist = await this.repository.findOne(id || 0);
    if (!atendenteExist) {
      throw new NotFoundException('Atendente não existe');
    }
    const atendente = this.repository.create(reqBody);
    atendente.id = id;

    return this.repository.save(atendente);
  }

  async delete(id: number): Promise<any> {
    const atendenteExist = await this.repository.findOne(id || 0);
    if (!atendenteExist) {
      throw new NotFoundException('Atendente não existe');
    }
    await this.repository.delete(id);
  }

  // override
  montaFiltro(queryParams: any): IFiltroAtendente {
    const retorno: IFiltroAtendente = {};

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

export default AtendenteService;
