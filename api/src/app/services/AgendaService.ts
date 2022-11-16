/* eslint-disable no-param-reassign */
import { Repository } from 'typeorm';
// import { Like } from 'typeorm';

import NotFoundException from '../exceptions/NotFoundException';
import { AgendaDetalheModel } from '../models/AgendaDetalheModel';
// import ValidationException from '../exceptions/ValidationException';
import { AgendaModel } from '../models/AgendaModel';
import BaseService from './BaseService';

interface IFiltroAgenda {
  id?: number;
  login?: any;
}

class AgendaService extends BaseService<AgendaModel> {
  // override
  repositoryDetalhe: Repository<AgendaDetalheModel>;
  constructor(nomeConexao = '') {
    super(nomeConexao, AgendaModel);
    this.repositoryDetalhe =
      this.connection.getRepository<AgendaDetalheModel>(AgendaDetalheModel);
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

      const agenda = await this.repository.findOne(where, { relations: ['agendaDetalhe'] });

      if (agenda) {
        return agenda;
      }

      throw new NotFoundException();
    }

    const agendas = await this.findAllPageable<AgendaModel>(this.repository, queryParams, {
      order: { id: 'ASC' },
    });

    return agendas;
  }

  async store(reqBody: AgendaModel): Promise<any> {
    const agenda = this.repository.create(reqBody);

    return this.repository.save(agenda);
  }

  async update(id: number, reqBody: AgendaModel): Promise<any> {
    const agendaExist = await this.repository.findOne(id || 0);
    if (!agendaExist) {
      throw new NotFoundException('Agenda não existe');
    }
    const agenda = this.repository.create(reqBody);
    agenda.id = id;

    return this.repository.save(agenda);
  }

  // override
  montaFiltro(queryParams: any): IFiltroAgenda {
    const retorno: IFiltroAgenda = {};

    if (queryParams) {
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }

      // if (queryParams.login) {
      //   retorno.login = Like(`%${queryParams.login}%`);
      // }
    }

    return retorno;
  }

  async delete(id: number): Promise<any> {
    const agendaExist = await this.repository.findOne(id || 0);
    if (!agendaExist) {
      throw new NotFoundException('Agenda não existe');
    }
    await this.repository.delete(id);
  }
}

export default AgendaService;
