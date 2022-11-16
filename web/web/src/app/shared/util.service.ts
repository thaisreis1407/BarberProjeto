import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import {differenceInMinutes } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  listaStatus = [];
  listaTiposPeriodo = [];
  listaTiposPeriodoContrato = [];
  listaUfs = [];
  agendaDoDia = 0;
  listaStatusContrato = [];
  listaStatusContratoStr = []; // usando no componente multselect
  listaTiposPeriodoParcela = [];
  listaStatusParcelaStr = []; // multselect
  listaStatusParcela = [];

  constructor(private deviceService: DeviceDetectorService) {
    this.carregaListaStatus();
    this.carregaListaTipoPeriodo();
    this.carregaListaTipoPeriodoContrato();
    this.carregaListaUfs();
    this.carregaListaStatusContrato();
    this.carregaListaStatusParcela();
    this.carregaListaTipoPeriodoParcela();
  }

  private carregaListaStatus() {
    this.listaStatus = [
      { label: '1° Contato', value: 0 },
      { label: 'Negociação', value: 1 },
      { label: 'Documentação', value: 2 },
      { label: 'Contrato', value: 3 },
      { label: 'BKO', value: 4 }
    ];
  }

  private carregaListaStatusContrato() {
    this.listaStatusContrato = [
      { label: 'PROTOCOLO', value: 0 },
      { label: 'AGUARDANDO', value: 1 },
      { label: 'INPUT REALIZADO', value: 2 },
      { label: 'PEND. OPERADORA', value: 3 },
      { label: 'PEND. EMPRESA', value: 4 },
      { label: 'REENVIADO', value: 5 },
      { label: 'CONCLUÍDO', value: 6 },
      { label: 'CANCELADO', value: 7 }
    ];
    // cria lista onde o value é um str, para evitar problemas com o componente
    // p-multiSelect
    this.listaStatusContratoStr = [];
    this.listaStatusContrato.map(item => {
      this.listaStatusContratoStr.push({
        label: item.label,
        value: item.value.toString()
      });
    });
  }

  private carregaListaStatusParcela() {
    this.listaStatusParcela = [
      { label: 'ABERTO', value: 0 },
      { label: 'BAIXADO', value: 1 },
    ];
    // cria lista onde o value é um str, para evitar problemas com o componente
    // p-multiSelect
    this.listaStatusParcelaStr = [];
    this.listaStatusParcela.map(item => {
      this.listaStatusParcelaStr.push({
        label: item.label,
        value: item.value.toString()
      });
    });
  }

  public telaMobile() {
    return (this.deviceService.isMobile() || this.deviceService.isTablet()) &&
      window.innerWidth <= 640;
  }
  private carregaListaTipoPeriodo() {
    this.listaTiposPeriodo = [
      { label: 'Dt. Funil', value: 0 },
      { label: 'Dt. Visita', value: 1 },
      { label: 'Px. Visita', value: 2 }
    ];
  }

  private carregaListaTipoPeriodoContrato() {
    this.listaTiposPeriodoContrato = [
      { label: 'Dt. Entrega', value: 0 },
      { label: 'Dt. Input', value: 1 },
      { label: 'Dt. Fechamento', value: 2 },
      { label: 'Dt. Trabalho', value: 3 }
    ];
  }

  private carregaListaTipoPeriodoParcela() {
    this.listaTiposPeriodoParcela = [
      { label: 'Dt. Emissão', value: 0 },
      { label: 'Dt. Vencimento', value: 1 },
      { label: 'Dt. Baixa', value: 2 },
    ];
  }

  private carregaListaUfs() {
    this.listaUfs = [
      { label: 'AC', value: 'AC' }, { label: 'AL', value: 'AL' }, { label: 'AP', value: 'AP' },
      { label: 'AM', value: 'AM' }, { label: 'BA', value: 'BA' }, { label: 'CE', value: 'CE' },
      { label: 'DF', value: 'DF' }, { label: 'ES', value: 'ES' }, { label: 'GO', value: 'GO' },
      { label: 'MA', value: 'MA' }, { label: 'MT', value: 'MT' }, { label: 'MS', value: 'MS' },
      { label: 'MG', value: 'MG' }, { label: 'PA', value: 'PA' }, { label: 'PB', value: 'PB' },
      { label: 'PR', value: 'PR' }, { label: 'PE', value: 'PE' }, { label: 'PI', value: 'PI' },
      { label: 'RJ', value: 'RJ' }, { label: 'RN', value: 'RN' }, { label: 'RS', value: 'RS' },
      { label: 'RO', value: 'RO' }, { label: 'RR', value: 'RR' }, { label: 'SC', value: 'SC' },
      { label: 'SP', value: 'SP' }, { label: 'SE', value: 'SE' }, { label: 'TO', value: 'TO' },
    ];
  }

  public findArrayFromField(array: any[], nomeCampo: string, valorCampo: any) {
    let retorno = null;
    array.forEach(
      elemento => {
        if (elemento.hasOwnProperty(nomeCampo)) {
          try {
            if ( elemento[nomeCampo] !== null &&
              JSON.stringify(elemento[nomeCampo]) === JSON.stringify(valorCampo)) {
              retorno = elemento;
            }
          } catch (error) {
          }
        }
      });
    return retorno;
  }

  converterStringsParaHora(objeto: any, listaCampos: string[]): any {
    return this.converterStringsParaDataHora(objeto, listaCampos, 'HH:mm');
  }

  converterStringsParaData(objeto: any, listaCampos: string[]): any {
    return this.converterStringsParaDataHora(objeto, listaCampos, 'YYYY-MM-DD');
  }

  public somaDataHora(data: Date, hora: Date) {
    const dataHora = formatDate(data, 'dd-MM-yyyy', 'pt-BR') + ' ' + formatDate(hora, 'hh:mm', 'pt-BR');
    return moment(dataHora, 'DD-MM-YYYY HH:mm').toDate();
  }

  public stringParaData(data: string, formato = '') {
    if (formato === '') {
      return moment(data, 'DD-MM-YYYY').toDate();
    } else {
      return moment(data, formato).toDate();
    }
  }

  public stringParaHora(hora: string) {
    return moment(hora, 'HH:mm').toDate();
  }

  public getDiferencaEmMinutos(dateFinal, dateInicial) {
    return differenceInMinutes(dateFinal, dateInicial);
  }


  public dataParaString(data: Date, formato = 'dd-MM-yyyy') {
    return formatDate(data, formato, 'pt-BR');
  }

  public extrairDia(data: Date) {
    return Number(formatDate(data, 'dd', 'pt-BR'));
  }
  public horaParaString(hora: Date) {
    return formatDate(hora, 'HH:mm', 'pt-BR');
  }

  public stringParaDataHora(dataHora: string) {
    return moment(dataHora, 'DD-MM-YYYY hh:mm').toDate();
  }

  public clonaObj(obj: any) {
    if (!obj) {
      return null;
    }
    const objJson = JSON.stringify(obj);
    if (!objJson || objJson === '{}') {
      return null;
    }
    return JSON.parse(objJson);
  }

  public buscaDataAtual() {
    const dataAtual = new Date();
    return this.stringParaData(this.dataParaString(dataAtual));
  }

  private converterStringsParaDataHora(objeto: any, listaCampos: string[], formato: string): any {
    listaCampos.map(
      nomeCampo => {
        if (objeto.hasOwnProperty(nomeCampo)) {
          try {
            if ( objeto[nomeCampo] !== null) {
              objeto[nomeCampo] = moment(objeto[nomeCampo], formato).toDate();
            }
          } catch (error) {
          }
        }
      }
    );
    return objeto;
  }

  public converterDatasStrings(objeto: any, listaCampos: string[]): any {
    const objRetorno = Object.assign({}, objeto);
    listaCampos.map(
      nomeCampo => {
        if (objRetorno.hasOwnProperty(nomeCampo)) {
          try {
            if ( objRetorno[nomeCampo] !== null) {
              objRetorno[nomeCampo] = formatDate(objRetorno[nomeCampo], 'yyyy-MM-dd', 'pt-BR');
            }
          } catch (error) {
          }
        }
      }
    );
    return objRetorno;
  }

  public converterHorasStrings(objeto: any, listaCampos: string[]): any {
    const objRetorno = Object.assign({}, objeto);
    listaCampos.map(
      nomeCampo => {
        if (objRetorno.hasOwnProperty(nomeCampo)) {
          try {
            if ( objRetorno[nomeCampo] !== null) {
              objRetorno[nomeCampo] = this.horaParaString(objRetorno[nomeCampo]);
            }
          } catch (error) {
          }
        }
      }
    );
    return objRetorno;
  }

  public navegar(rota: string) {
    let urlBase = window.location.protocol + '//' + window.location.hostname;
    if (window.location.port !== '') {
      urlBase = urlBase + ':' + window.location.port;
    }

    window.location.assign(urlBase + rota);
  }

  calculaItensPagina(alturaJanela: number, numeroItensMax: number) {
    return Math.round(alturaJanela * (numeroItensMax / 667));
  }

  diasEntreDatas(dataInicial: Date, dataFinal: Date) {
    if (dataFinal.getTime() > dataInicial.getTime()) {
      const a =  moment(dataInicial);
      const b =  moment(dataFinal);
      return b.diff(a, 'days');

    } else {
      return 0;
    }
  }

  geraDocumentoAuto() {
    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'W', 'Z'];
    const dataHora = new Date();
    let ano = '';
    const mes = letras[Number(this.dataParaString(dataHora, 'MM'))];
    const hora = letras[Number(this.dataParaString(dataHora, 'HH'))];

    if (Number(this.dataParaString(dataHora, 'yy')) > 23) {
      ano = letras[23 - Number(this.dataParaString(dataHora, 'yy'))];
    } else {
      ano = letras[Number(this.dataParaString(dataHora, 'yy'))];
    }
    return 'AUT-' + ano + mes + this.dataParaString(dataHora, 'dd')
      + hora + this.dataParaString(dataHora, 'mmss');
  }

  addDias(dataInicio: Date, dias: number): Date {
    const mData = moment(dataInicio).add(dias, 'days');
    return mData.toDate();
  }
}
