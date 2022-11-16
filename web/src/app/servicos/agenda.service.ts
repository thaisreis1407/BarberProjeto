import { UtilService } from './../shared/util.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './../seguranca/auth.service';
import { CustomHttp } from './../seguranca/custom-http';
import { ConfigService } from './../shared/config.service';
import { Agenda } from './../core/model';
import { BaseService } from './base-service';

export class AgendaFiltro {
  nome: string;
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
export class AgendaService  extends BaseService<Agenda> {
  agendaFiltro: AgendaFiltro;
  constructor(private customHttp: CustomHttp,
    private authService: AuthService,
    configService: ConfigService,
    private utilService: UtilService) {
      super(customHttp, authService);
      this.serviceURL = configService.apiUrl + '/agendas';
      this.agendaFiltro = new AgendaFiltro(configService);
    }

    getFiltro(): AgendaFiltro {
      // para gerar instancia unica juntamente com o servico
      return this.agendaFiltro;
    }

    adicionar(entidade: Agenda): Promise<Agenda> {
      const headers = new HttpHeaders();
      // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      headers.append('Content-Type', 'application/json');
      this.auth.mostrarStatus = true;
      const objEnviar = this.utilService.clonaObj(entidade);

      const novaListaDetalhe = entidade.agendaDetalhe.map(e => {
        return this.utilService.converterHorasStrings(e, ['horarioInicio', 'horarioFim']);
      });
      objEnviar.agendaDetalhe = novaListaDetalhe;

      return this.http.post<any>(this.serviceURL, objEnviar, { headers: headers})
        .toPromise()
        .then(response => {
          this.auth.mostrarStatus = false;
          return response;
        }
      ).catch(response => {
        this.auth.mostrarStatus = false;
        throw response;
      });
    }

    atualizar(entidade: any): Promise<Agenda> {
      const headers = new HttpHeaders();
      headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      headers.append('Content-Type', 'application/json');
      this.auth.mostrarStatus = true;

      const objEnviar = this.utilService.clonaObj(entidade);

      const novaListaDetalhe = entidade.agendaDetalhe.map(e => {
        return this.utilService.converterHorasStrings(e, ['horarioInicio', 'horarioFim']);
      });
      objEnviar.agendaDetalhe = novaListaDetalhe;

      return this.http.put<any>(`${this.serviceURL}/${objEnviar.id}`,
        objEnviar, { headers: headers})
        .toPromise()
        .then(response => {
          this.auth.mostrarStatus = false;
          return response;
        }
      ).catch(response => {
        this.auth.mostrarStatus = false;
        throw response;
      });
    }

    buscarPorId(id: number): Promise<Agenda> {
      const headers = new HttpHeaders();
      headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      this.auth.mostrarStatus = true;
      return this.http.get<Agenda>(`${this.serviceURL}/${id}`, { headers })
        .toPromise()
        .then(response => {
          this.auth.mostrarStatus = false;
          const novaListaDetalhe = response.agendaDetalhe.map(e => {
            return this.utilService.converterStringsParaHora(e, ['horarioInicio', 'horarioFim']);
          });

          response.agendaDetalhe = novaListaDetalhe;

          return response;
        }).catch(response => {
          this.auth.mostrarStatus = false;
          throw response;
        });
    }

    // atualizarPropriedadeInativo(id: number, inativo: boolean): Promise<void> {
    //   const headers = new HttpHeaders();
    //   // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    //   headers.append('Content-Type', 'application/json');
    //   this.auth.mostrarStatus = true;
    //   return this.http.put<any>(`${this.serviceURL}/${id}/inativo`,
    //     inativo, { headers: headers})
    //     .toPromise()
    //     .then(() => {
    //       this.auth.mostrarStatus = false;
    //       return null;
    //     }).catch(response => {
    //       this.auth.mostrarStatus = false;
    //       throw response;
    //     });
    // }

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

  consultar(filtro: AgendaFiltro): Promise<any> {
    const headers = new HttpHeaders();
    let params = new HttpParams();
    // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    this.auth.mostrarStatus = true;
    params = params.append('resumo', '');
    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }
    params = params.append('page', filtro.pagina.toString());
    params = params.append('size', filtro.itensPorPagina.toString());


    return this.http.get<any>(this.serviceURL, { headers: headers, params: params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const agenda = responseJson.content;
        const resultado = {
          agenda: agenda,
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
