export function loginRequest(nome: string, senha: string, redirectTo = ''): any {
  return {
    type: '@auth/LOGIN_REQUEST',
    payload: { nome, senha },
    redirectTo,
  };
}

export function loginSuccess(token: string, decodedToken: any, usuario: any): any {
  return {
    type: '@auth/LOGIN_SUCCESS',
    payload: { token, decodedToken, usuario },
  };
}

export function loginFailure(): any {
  return {
    type: '@auth/LOGIN_FAILURE',
  };
}

export function logout(): any {
  return {
    type: '@auth/LOGOUT',
  };
}
