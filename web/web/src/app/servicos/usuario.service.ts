import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './../seguranca/auth.service';
import { CustomHttp } from './../seguranca/custom-http';
import { ConfigService } from './../shared/config.service';
import { Usuario } from './../core/model';
import { BaseService } from './base-service';

export class UsuarioFiltro {
  login: string;

  pagina = 0;
  itensPorPagina = 5;

  constructor(
    private configService: ConfigService) {
    this.itensPorPagina = this.configService.qtdLinhasGrid;

  }
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService  extends BaseService<Usuario> {
  usuarioFiltro: UsuarioFiltro;
  constructor(private customHttp: CustomHttp,
    private authService: AuthService,
    configService: ConfigService) {
      super(customHttp, authService);
      this.serviceURL = configService.apiUrl + '/usuarios';
      this.usuarioFiltro = new UsuarioFiltro(configService);
    }

    getFiltro(): UsuarioFiltro {
      // para gerar instancia unica juntamente com o servico
      return this.usuarioFiltro;
    }

    atualizarPropriedadeInativo(id: number, inativo: boolean): Promise<void> {
      const headers = new HttpHeaders();
      // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      headers.append('Content-Type', 'application/json');
      this.auth.mostrarStatus = true;
      return this.http.put<any>(`${this.serviceURL}/${id}/inativo`,
        inativo, { headers: headers})
        .toPromise()
        .then(() => {
          this.auth.mostrarStatus = false;
          return null;
        }).catch(response => {
          this.auth.mostrarStatus = false;
          throw response;
        });
    }

  alterarSenha(login: string, senhaNova: string, senhaAntiga): Promise<void> {
    const headers = new HttpHeaders();
    const objSenha = {'senhaNova': senhaNova, 'senhaAntiga': senhaAntiga};
    // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    headers.append('Content-Type', 'application/json');
    return this.http.put<any>(`${this.serviceURL}/${login}/senha`, objSenha,
      { headers: headers})
      .toPromise()
      .then(() => null);
  }

  consultar(filtro: UsuarioFiltro): Promise<any> {
    const headers = new HttpHeaders();
    let params = new HttpParams();
    // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    this.auth.mostrarStatus = true;
    params = params.append('resumo', '');
    if (filtro.login && filtro.login.trim() !== '') {
      params = params.append('login', filtro.login);
    }

    params = params.append('page', filtro.pagina.toString());
    params = params.append('size', filtro.itensPorPagina.toString());


    return this.http.get<any>(this.serviceURL, { headers: headers, params: params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const usuarios = responseJson.content;
        const resultado = {
          usuarios: usuarios,
          total: responseJson.totalElements
        };
        this.auth.mostrarStatus = false;
        return resultado;
    }).catch(response => {
      this.auth.mostrarStatus = false;
      throw response;
    });
  }

  // listarGerentes(): Promise<any> {
  //   const headers = new Headers();
  //   headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
  //   this.auth.mostrarStatus = true;
  //   return this.http.get<any>(`${this.serviceURL}/?perfilUsuarioLider=1`, { headers: headers })
  //     .toPromise()
  //     .then(response => {
  //       this.auth.mostrarStatus = false;
  //       return response;
  //   }).catch(response => {
  //     this.auth.mostrarStatus = false;
  //     throw response;
  //   });
  // }
}
