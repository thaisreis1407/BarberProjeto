import { UtilService } from './../shared/util.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './../seguranca/auth.service';
import { CustomHttp } from './../seguranca/custom-http';
import { ConfigService } from './../shared/config.service';
import { Agendamento } from './../core/model';
import { BaseService } from './base-service';

export class AgendamentoFiltro {
  idCliente: number;
  idAtendente: number;
  dataInicio: Date;
  dataFim: Date;
  status: String;
  pagina = 0;
  itensPorPagina = 5;

  constructor(
    private configService: ConfigService,
    private utilService: UtilService) {

    this.itensPorPagina = this.configService.qtdLinhasGrid;
    this.dataFim = new Date();
    this.dataInicio = this.utilService.addDias(this.dataFim, -30);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService  extends BaseService<Agendamento> {
  agendamentoFiltro: AgendamentoFiltro;
  constructor(private customHttp: CustomHttp,
    private authService: AuthService,
    configService: ConfigService,
    private utilService: UtilService) {
      super(customHttp, authService);
      this.serviceURL = configService.apiUrl + '/agendamentos';
      this.agendamentoFiltro = new AgendamentoFiltro(configService, utilService);
    }

    getFiltro(): AgendamentoFiltro {
      // para gerar instancia unica juntamente com o servico
      return this.agendamentoFiltro;
    }


    abrirAtendimento(id: number): Promise<void> {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      this.auth.mostrarStatus = true;
      return this.http.put<any>(`${this.serviceURL}/${id}/abrirAtendimento`, {}, { headers: headers})
        .toPromise()
        .then(() => {
          this.auth.mostrarStatus = false;
          return null;
        }).catch(response => {
          this.auth.mostrarStatus = false;
          throw response;
        });
    }

    excluirAtendimento(id: number): Promise<void> {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      this.auth.mostrarStatus = true;
      return this.http.put<any>(`${this.serviceURL}/${id}/excluirAtendimento`, {}, { headers: headers})
        .toPromise()
        .then(() => {
          this.auth.mostrarStatus = false;
          return null;
        }).catch(response => {
          this.auth.mostrarStatus = false;
          throw response;
        });
    }

    buscarPorId(id: number): Promise<Agendamento> {
      const headers = new HttpHeaders();
      headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      this.auth.mostrarStatus = true;
      return this.http.get<Agendamento>(`${this.serviceURL}/${id}`, { headers })
        .toPromise()
        .then(response => {
          this.auth.mostrarStatus = false;
          let retorno = this.utilService.converterStringsParaData(response, ['data']);
          retorno = this.utilService.converterStringsParaHora(retorno, ['hora']);

          if (retorno.atendimento) {
            retorno.atendimento = this.utilService.converterStringsParaData(retorno.atendimento, ['dataFim']);
            retorno.atendimento = this.utilService.converterStringsParaHora(retorno.atendimento, ['horaFim']);

            retorno.atendimento = this.utilService.converterStringsParaData(retorno.atendimento, ['dataInicio']);
            retorno.atendimento = this.utilService.converterStringsParaHora(retorno.atendimento, ['horaInicio']);
          }

          return retorno;
        }).catch(response => {
          this.auth.mostrarStatus = false;
          throw response;
        });
    }


    consultarPorData(data: Date): Promise<any> {

      const headers = new HttpHeaders();
      let params = new HttpParams();
      // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      this.auth.mostrarStatus = true;

      params = params.append('data', this.utilService.dataParaString(data, 'yyyy-MM-dd'));

      params = params.append('page', '0');
      params = params.append('size', '100');

      return this.http.get<any>(this.serviceURL, { headers: headers, params: params })
        .toPromise()
        .then(response => {
          const responseJson = response;
          const agendamentos = responseJson;
          const resultado = {
            agendamentos: agendamentos,
          };
          this.auth.mostrarStatus = false;
          return resultado;
      }).catch(response => {
        this.auth.mostrarStatus = false;
        throw response;
      });
   }

    consultar(filtro: AgendamentoFiltro): Promise<any> {
      const headers = new HttpHeaders();
      let params = new HttpParams();
      // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
      this.auth.mostrarStatus = true;
      params = params.append('resumo', '');

      if (filtro.idCliente) {
        params = params.append('idCliente', filtro.idCliente.toString());
      }
      if (filtro.idAtendente) {
        params = params.append('idAtendente', filtro.idAtendente.toString());
      }
      if (filtro.dataInicio) {
        params = params.append('dataInicio', filtro.dataInicio.toDateString());
      }
      if (filtro.dataFim) {
        params = params.append('dataFim', filtro.dataFim.toDateString());
      }
      if (filtro.status){
        params = params.append('status', filtro.status.toString());
      }
      params = params.append('page', filtro.pagina.toString());
      params = params.append('size', filtro.itensPorPagina.toString());

      return this.http.get<any>(this.serviceURL, { headers: headers, params: params })
        .toPromise()
        .then(response => {
          const responseJson = response;
          const agendamentos = responseJson.content;
          const resultado = {
            agendamentos: agendamentos,
            total: responseJson.totalElements
          };
          this.auth.mostrarStatus = false;
          return resultado;
      }).catch(response => {
        this.auth.mostrarStatus = false;
        throw response;
      });
   }

   adicionar(entidade: Agendamento): Promise<Agendamento> {
    const headers = new HttpHeaders();
    // headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    headers.append('Content-Type', 'application/json');

    let objEnviar = this.utilService.converterDatasStrings(entidade, ['data']);
    objEnviar = this.utilService.converterHorasStrings(entidade, ['hora']);

    if (objEnviar.atendimento) {
      objEnviar.atendimento = this.utilService.converterDatasStrings(objEnviar.atendimento, ['dataFim']);
      objEnviar.atendimento = this.utilService.converterHorasStrings(objEnviar.atendimento, ['horaFim']);

      objEnviar.atendimento = this.utilService.converterDatasStrings(objEnviar.atendimento, ['dataInicio']);
      objEnviar.atendimento = this.utilService.converterHorasStrings(objEnviar.atendimento, ['horaInicio']);
    }

    this.auth.mostrarStatus = true;

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

  atualizar(entidade: any): Promise<Agendamento> {
    const headers = new HttpHeaders();
    headers.append('Authorization', 'Basic YWRtaW5pc3RyYWRvcjpzcGVlZHlhZG1pbjAt');
    headers.append('Content-Type', 'application/json');
    let objEnviar = this.utilService.converterDatasStrings(entidade, ['data']);
    objEnviar = this.utilService.converterHorasStrings(entidade, ['hora']);

    if (objEnviar.atendimento) {
      objEnviar.atendimento = this.utilService.converterDatasStrings(objEnviar.atendimento, ['dataFim']);
      objEnviar.atendimento = this.utilService.converterHorasStrings(objEnviar.atendimento, ['horaFim']);

      objEnviar.atendimento = this.utilService.converterDatasStrings(objEnviar.atendimento, ['dataInicio']);
      objEnviar.atendimento = this.utilService.converterHorasStrings(objEnviar.atendimento, ['horaInicio']);
    }

    this.auth.mostrarStatus = true;
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
}
