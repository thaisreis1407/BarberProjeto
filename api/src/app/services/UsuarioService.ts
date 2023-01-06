/* eslint-disable no-param-reassign */
// import { Like } from 'typeorm';

import md5 from 'md5';

import NotFoundException from '../exceptions/NotFoundException';
import ValidationException from '../exceptions/ValidationException';
import { UsuarioModel } from '../models/UsuarioModel';
import BaseService from './BaseService';

interface IFiltroUsuario {
  id?: number;
  login?: any;
  inativo?: any;
}

class UsuarioService extends BaseService<UsuarioModel> {
  // override
  constructor(nomeConexao = '') {
    super(nomeConexao, UsuarioModel);
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

      const usuario = await this.repository.findOne(where);

      if (usuario) {
        return usuario;
      }

      throw new NotFoundException();
    }

    const usuarios = await this.findAllPageable<UsuarioModel>(this.repository, queryParams, {
      order: { login: 'ASC' },
    });

    return usuarios;
  }

  async store(reqBody: UsuarioModel): Promise<any> {
    reqBody.login = reqBody.login.toUpperCase();
    const userExists = await this.repository.findOne({
      where: { login: reqBody.login },
    });

    if (userExists) {
      throw new ValidationException('Usuario já existe');
    }

    reqBody.senha = md5(reqBody.senha);

    const usuario = this.repository.create(reqBody);
    return this.repository.save(usuario);
  }

  async update(id: number, reqBody: UsuarioModel): Promise<any> {
    reqBody.login = reqBody.login.toUpperCase();

    const usuarioExist = await this.repository.findOne(id || 0);
    if (!usuarioExist) {
      throw new NotFoundException('Usuário não existe');
    }

    if (reqBody.senha) {
      reqBody.senha = md5(reqBody.senha);
    } else {
      reqBody.senha = usuarioExist.senha;
    }

    const usuario = this.repository.create(reqBody);
    usuario.id = id;
    return this.repository.save(usuario);
  }

  async delete(id: number): Promise<any> {
    const usuarioExist = await this.repository.findOne(id || 0);
    if (!usuarioExist) {
      throw new NotFoundException('Usuário não existe');
    }
    await this.repository.delete(id);
  }

  // override
  montaFiltro(queryParams: any): IFiltroUsuario {
    const retorno: IFiltroUsuario = {};

    if (queryParams) {
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }

      if (queryParams.login) {
        // retorno.login = Like(`%${queryParams.login}%`);
        retorno.login = queryParams.login;
      }

      if (queryParams.inativo === true || queryParams.inativo === false) {
        retorno.inativo = queryParams.inativo;
      }
    }

    return retorno;
  }
}

export default UsuarioService;
