import { store } from '../store';
import { getDecodedToken } from '../util/functions';

class AuthService {
  acessToken(): any {
    const { token } = store.getState().auth;

    try {
      const decoded: any = getDecodedToken(token);

      return {
        signed: true,
        exp: decoded.exp,
        usuario: decoded.usuario,
        token,
      };
    } catch (error) {
      return {
        signed: false,
        exp: 0,
        token: '',
      };
    }
  }

  getUsuario(): any {
    const { decodedToken } = store.getState().auth;
    const { usuario, vendedorColaborador } = decodedToken;
    const usuarioLogado = {
      ...usuario,
      vendedorColaborador,
    };

    try {
      return usuarioLogado;
    } catch (error) {
      return null;
    }
  }

  getApiInfo(): any {
    const apiInfo = JSON.parse(localStorage.getItem('apiInfo') || '');
    return apiInfo;
  }

  checkRoles(arrayNames: string[] | string): any {
    const { decodedToken } = store.getState().auth;

    if (!decodedToken) {
      return false;
    }
    const { authorities } = decodedToken;
    const roles = authorities;

    if (!Array.isArray(arrayNames)) {
      arrayNames = arrayNames ? [arrayNames] : [];
    }

    if (arrayNames.length === 0) {
      return true;
    }

    let ret = false;

    for (let x = 0; x < arrayNames.length; x++) {
      const e = arrayNames[x];
      if (!roles || !Array.isArray(roles)) {
        return false;
      }
      if (roles.includes(e)) {
        ret = true;
        return true;
      }
    }

    return ret;
  }
}

export default new AuthService();
