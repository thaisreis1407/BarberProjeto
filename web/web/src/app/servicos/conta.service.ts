import { UtilService } from './../shared/util.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './../seguranca/auth.service';
import { CustomHttp } from './../seguranca/custom-http';
import { ConfigService } from './../shared/config.service';
import { Conta } from './../core/model';
import { BaseService } from './base-service';

// Declarar Filtros na tela.
export class ContaFiltro {
  descricao: string;
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
export class ContaService  extends BaseService<Conta> {
  contaFiltro: ContaFiltro;
  constructor(private customHttp: CustomHttp,
    private authService: AuthService,
    configService: ConfigService,
    private utilService: UtilService) {
      super(customHttp, authService);
      this.serviceURL = configService.apiUrl + '/contas';
      this.contaFiltro = new ContaFiltro(configService);
    }

    getFiltro(): ContaFiltro {
      // para gerar instancia unica juntamente com o servico
      return this.contaFiltro;
    }

    buscarPorId(id: number): Promise<Conta> {
      const headers = new HttpHeaders();
      headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      this.auth.mostrarStatus = true;
      return this.http.get<Conta>(`${this.serviceURL}/${id}`, { headers })
        .toPromise()
        .then(response => {
          this.auth.mostrarStatus = false;
          const retorno = this.utilService.converterStringsParaData(response, ['ultimoCorte']);
          return retorno;
        }).catch(response => {
          this.auth.mostrarStatus = false;
          throw response;
        });
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

  consultar(filtro: ContaFiltro): Promise<any> {
    const headers = new HttpHeaders();
    let params = new HttpParams();
    // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    this.auth.mostrarStatus = true;
    params = params.append('resumo', '');
    if (filtro.descricao) {
      params = params.append('descricao', filtro.descricao);
    }
    params = params.append('page', filtro.pagina.toString());
    params = params.append('size', filtro.itensPorPagina.toString());


    return this.http.get<any>(this.serviceURL, { headers: headers, params: params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const contas = responseJson.content;
        const resultado = {
          contas: contas,
          total: responseJson.totalElements
        };
        this.auth.mostrarStatus = false;
        return resultado;
    }).catch(response => {
      this.auth.mostrarStatus = false;
      throw response;
    });
  }
}
