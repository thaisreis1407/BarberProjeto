/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-param-reassign */
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import { checkPassword, versionInfo } from '../../util/functions';
import { getRoles } from '../../util/security';
import AuthenticationException from '../exceptions/AuthenticationException';
import { UsuarioModel } from '../models/UsuarioModel';
import BaseService from './BaseService';

class SessionService extends BaseService<UsuarioModel> {
  constructor(nomeConexao = '') {
    super(nomeConexao, UsuarioModel);
    this.carregaConexao(nomeConexao);
  }

  public carregaConexao(nomeConexao: string): void {
    super.carregaConexao(nomeConexao);
  }

  geraToken(usuario: any, refreshToken = false): any {
    const { id, perfil } = usuario;

    const acessToken = jwt.sign(
      {
        apiInfo: versionInfo(),
        login: usuario.login,
        authorities: getRoles(perfil),
        usuario: {
          id,
          idColaborador: usuario.idColaborador,
          login: usuario.login,
          perfil,
        },
      },
      authConfig.secret,
      {
        expiresIn: refreshToken ? authConfig.expiresInRefreshToken : authConfig.expiresIn,
      }
    );

    if (refreshToken) {
      return acessToken;
    }

    let timeSegundos = 0;
    const expiresIn = authConfig.expiresIn.toUpperCase();
    if (expiresIn.includes('S')) {
      timeSegundos = Number(expiresIn.replace('S', ''));
    } else if (expiresIn.includes('M')) {
      timeSegundos = Number(expiresIn.replace('M', '')) * 60;
    } else if (expiresIn.includes('H')) {
      timeSegundos = Number(expiresIn.replace('H', '')) * 60 * 60;
    }

    if (
      timeSegundos === null ||
      timeSegundos === undefined ||
      timeSegundos.toString() === 'NaN'
    ) {
      timeSegundos = 0;
    }

    return {
      apiInfo: versionInfo(),
      expires_in: timeSegundos,
      expires_in_h: expiresIn,
      access_token: acessToken,
      scope: 'read write',
      token_type: 'bearer',
    };
  }

  async validaLogin(login: string, senha: string): Promise<void> {
    login = login.toUpperCase();
    const usuario = await this.repository.findOne({ login });

    if (!usuario) {
      throw new AuthenticationException('Usuário ou Senha inválida');
    }

    if (!checkPassword(login, senha, usuario.senha)) {
      throw new AuthenticationException('Usuário ou Senha inválida');
    }
  }

  async login(reqBody: any, cookies: any): Promise<any[]> {
    if (reqBody.grant_type === 'refreshToken') {
      if (cookies) {
        const { refreshToken } = cookies;
        if (refreshToken) {
          try {
            const acessToken: any = jwt.verify(refreshToken, authConfig.secret);
            if (acessToken) {
              reqBody.login = acessToken.login;
            }
          } catch (e) {
            throw new AuthenticationException('refreshToken inválido');
          }
        }
      }
      if (!reqBody.login) {
        throw new AuthenticationException('refreshToken inválido');
      }
    }

    if (reqBody.grantType !== 'refreshToken') {
      // try {
      //   shema.validateSync(reqBody);
      // } catch (err) {
      //   throw new ValidationException(
      //     err.message ? err.message : 'Falha de validação nos dados.'
      //   );
      // }
    }

    const { username, password } = reqBody;

    const usuario = await this.repository.findOne({ login: username.toUpperCase() });

    if (!usuario) {
      throw new AuthenticationException('Usuário ou Senha inválida');
      // return res.status(401).json(geraObjError(''));
    }

    if (reqBody.grant_type !== 'refreshToken') {
      if (!checkPassword(usuario.login, password, usuario.senha)) {
        // return res.status(401).json(geraObjError('Usuário ou Senha inválida'));
        throw new AuthenticationException('Usuário ou Senha inválida');
      }
    }

    const refreshToken = this.geraToken(usuario, true);

    return [this.geraToken(usuario), refreshToken];
  }
}

export default SessionService;
