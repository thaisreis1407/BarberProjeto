import { UtilService } from './../shared/util.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './../seguranca/auth.service';
import { CustomHttp } from './../seguranca/custom-http';
import { ConfigService } from './../shared/config.service';
import { MovimentacaoConta } from './../core/model';
import { BaseService } from './base-service';

export class MovimentacaoContaFiltro {
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
export class MovimentacaoContaService  extends BaseService<MovimentacaoConta> {
  movimentacaoContaFiltro: MovimentacaoContaFiltro;
  constructor(private customHttp: CustomHttp,
    private authService: AuthService,
    configService: ConfigService,
    private utilService: UtilService) {
      super(customHttp, authService);
      this.serviceURL = configService.apiUrl + '/movimentacoesContas';
      this.movimentacaoContaFiltro = new MovimentacaoContaFiltro(configService);
    }

    getFiltro(): MovimentacaoContaFiltro {
      // para gerar instancia unica juntamente com o servico
      return this.movimentacaoContaFiltro;
    }

    buscarPorId(id: number): Promise<MovimentacaoConta> {
      const headers = new HttpHeaders();
      headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      this.auth.mostrarStatus = true;
      return this.http.get<MovimentacaoConta>(`${this.serviceURL}/${id}`, { headers })
        .toPromise()
        .then(response => {
          this.auth.mostrarStatus = false;
          const retorno = this.utilService.converterStringsParaData(response, ['dataMovimentacao']);
          return retorno;
        }).catch(response => {
          this.auth.mostrarStatus = false;
          throw response;
        });
    }

  consultar(filtro: MovimentacaoContaFiltro): Promise<any> {
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
        const movimentacoesContas = responseJson.content;
        const resultado = {
          movimentacoesContas: movimentacoesContas,
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
