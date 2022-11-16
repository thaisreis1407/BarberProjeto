import { UtilService } from './../shared/util.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './../seguranca/auth.service';
import { CustomHttp } from './../seguranca/custom-http';
import { ConfigService } from './../shared/config.service';
import { ProdutoServico } from './../core/model';
import { BaseService } from './base-service';

export class ProdutoServicoFiltro {
  descricao: string;
  tipo: number;
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
export class ProdutoServicoService  extends BaseService<ProdutoServico> {
  produtoFiltro: ProdutoServicoFiltro;
  constructor(private customHttp: CustomHttp,
    private authService: AuthService,
    configService: ConfigService,
    private utilService: UtilService) {
      super(customHttp, authService);
      this.serviceURL = configService.apiUrl + '/produtosServicos';
      this.produtoFiltro = new ProdutoServicoFiltro(configService);
    }

    getFiltro(): ProdutoServicoFiltro {
      // para gerar instancia unica juntamente com o produto
      return this.produtoFiltro;
    }

    buscarPorId(id: number): Promise<ProdutoServico> {
      const headers = new HttpHeaders();
      headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      this.auth.mostrarStatus = true;
      return this.http.get<ProdutoServico>(`${this.serviceURL}/${id}`, { headers })
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

  consultar(filtro: ProdutoServicoFiltro): Promise<any> {
    const headers = new HttpHeaders();
    let params = new HttpParams();
    // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    this.auth.mostrarStatus = true;
    params = params.append('resumo', '');
    if (filtro.descricao) {
      params = params.append('descricao', filtro.descricao);
    }
    if (filtro.tipo) {
      params = params.append('tipo', filtro.tipo.toString());
    }
    params = params.append('page', filtro.pagina.toString());
    params = params.append('size', filtro.itensPorPagina.toString());


    return this.http.get<any>(this.serviceURL, { headers: headers, params: params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const produtosServicos = responseJson.content;

        const resultado = {
          produtosServicos: produtosServicos,
          total: responseJson.totalElements
        };
        this.auth.mostrarStatus = false;
        return resultado;
    }).catch(response => {
      this.auth.mostrarStatus = false;
      throw response;
    });
  }

  listarProdutos(pTipo: number): Promise<any> {
    const headers = new HttpHeaders();
    headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    // mostrarStatus o carregando
    this.auth.mostrarStatus = true;
    return this.http.get<any>(`${this.serviceURL}?tipo=${pTipo}`, { headers: headers })
      .toPromise()
      .then(response => {
        this.auth.mostrarStatus = false;
        return response.content;
    }).catch(response => {
      this.auth.mostrarStatus = false;
      throw response;
    });
  }

}
