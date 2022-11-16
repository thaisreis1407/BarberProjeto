import { Connection, Repository, getConnection, BaseEntity } from 'typeorm';

import { montaPaginacao } from '../../util/functions';
import { IPageable } from '../../util/tipos';

class BaseService<T extends BaseEntity> {
  connection: Connection;
  modelType: typeof BaseEntity;
  repository: Repository<T>;
  nomeConexao: string;

  constructor(nomeConexao = '', modelType: typeof BaseEntity) {
    this.modelType = modelType;
    this.carregaConexao(nomeConexao);
    this.nomeConexao = nomeConexao;
  }

  public carregaConexao(nomeConexao: string): void {
    this.connection = getConnection(nomeConexao);
    this.repository = this.connection.getRepository<T>(this.modelType);
  }

  async findAllPageable<T>(
    repository: Repository<T>,
    queryParams: any,
    opcoesExtras?: any
  ): Promise<IPageable> {
    const paginacao = montaPaginacao(queryParams.page, queryParams.size);
    let opcoes: any = {};

    const filtros = this.montaFiltro(queryParams);

    if (filtros) {
      opcoes.where = filtros;
    }

    const { size, offset } = paginacao;
    const { page } = queryParams;

    opcoes = { ...opcoes, ...opcoesExtras, ...paginacao };

    const content = await repository.find({ ...opcoes, take: size, skip: offset });

    // buscando total de registros
    const tot = await repository.count({ where: opcoes.where, take: size, skip: offset });

    return {
      totalPages: size > 0 ? Math.ceil(tot / size) : 0,
      page: Number(page) || 0,
      size: size || 0,
      totalElements: tot,
      content,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  montaFiltro(queryParams: any): any {
    return null;
  }
}

export default BaseService;
