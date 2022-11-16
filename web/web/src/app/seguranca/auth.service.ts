import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { UtilService } from './../shared/util.service';
import { ConfigService } from './../shared/config.service';
import { Usuario, Empresa } from './../core/model';

@Injectable()
export class AuthService {

  oauthTokenUrl: string;
  jwtPayload: any;
  usuario: Usuario;
  mostrarStatus = false;
  versaoApi = '0';
  urlVersaoApi = '';
  tokensRevokeUrl = '';
  private ultimaAtualizacaoVersao: Date;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private utilService: UtilService,
    configService: ConfigService,
    private router: Router,
  ) {
    this.urlVersaoApi = configService.apiUrl + '/api';
    this.oauthTokenUrl = configService.apiUrl + '/oauth/token';
    this.tokensRevokeUrl = configService.apiUrl + '/tokens/revoke';
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/x-www-form-urlencoded')
        .append('Authorization', 'Basic YW5ndWxhcjpiYXJiZXIwLQ==');

    const body = `client=&username=${usuario}&password=${senha}&grant_type=password`;

    this.mostrarStatus = true;
    return this.http.post<any>(this.oauthTokenUrl, body, { headers, withCredentials: false })
      .toPromise()
      .then(response => {
        this.armazenarToken(response.access_token);
        this.mostrarStatus = false;
      })
      .catch(response => {
        this.mostrarStatus = false;
        if (response.status === 400) {
          if (response.error.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        } else if (response.status === 401) {
          if (response.error.error === 'unauthorized') {
            return Promise.reject('Usuário desativado / Usuário ou senha inválida');
          } else {
            return Promise.reject(response);
          }
        }
        return Promise.reject(response);
      });
  }

  async verificaVersaoApi(forcar = false) {
    if (forcar || !this.ultimaAtualizacaoVersao
      || new Date().getTime() - this.ultimaAtualizacaoVersao.getTime() > 60000) {
      const token = localStorage.getItem('token');
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        this.ultimaAtualizacaoVersao = new Date();
        const headers = new HttpHeaders();
        headers.append('Accept', 'application/json')
              .append('Content-Type', 'application/json')
              .append('Authorization', 'Bearer ' + token);

        // return await this.http.get<any>(`${this.urlVersaoApi}`, { headers: headers })
        // .toPromise()
        // .then(response => {
        //   this.versaoApi = response.versaoApi;
        // }).catch((response) => {
        //   this.versaoApi = '';
        //   throw response;
        // });
      }
    }
  }

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/x-www-form-urlencoded')
        .append('Authorization', 'Basic YW5ndWxhcjpiYXJiZXIwLQ==');

    const body = 'grant_type=refresh_token';

    return this.http.post<any>(this.oauthTokenUrl, body,
        { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response.access_token);

        console.log('Novo access token criado!');

        return Promise.resolve(null);
      })
      .catch(response => {
        console.error('Erro ao renovar token.', response);
        // this.router.navigate(['/login']);
        this.utilService.navegar('/login');
      }).catch(() => {
        return Promise.resolve(null);
      });
  }

  limparAccessToken() {
    this.ultimaAtualizacaoVersao = null;
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    const resultado = !token || this.jwtHelper.isTokenExpired(token);
    if (!resultado) {
      this.verificaVersaoApi();
    }
    return resultado;
  }

  public temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  public usuarioLogado() {
    return this.jwtPayload && this.jwtPayload.user_name;
  }

  public admConfiguracao() {
    return this.jwtPayload && this.jwtPayload.adm_configuracao;
  }

  public perfilUsuario() {
    if (this.jwtPayload && this.jwtPayload.usuario) {
      return this.jwtPayload.usuario.perfil;
    } else {
      return '';
    }
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

  public logout() {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.ultimaAtualizacaoVersao = new Date();
      const headers = new HttpHeaders();
      headers.append('Accept', 'application/json')
             .append('Content-Type', 'application/json')
             .append('Authorization', 'Bearer ' + token);
    this.http.delete(this.tokensRevokeUrl)
      .toPromise()
      .then(() => {
        this.limparAccessToken();
        // this.route.navigate(['/login']);
        this.utilService.navegar('/login');
      }).catch(erro => {
        throw erro;
      });
    }
  }
}
