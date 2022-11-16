/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-throw-literal */
import { format, parse, lastDayOfMonth, addMonths, addHours } from 'date-fns';
import md5 from 'md5';

import { version } from '../../package.json';
import { CodError } from './constants';

export function addParamSql(sqlOrigem: string, sqlAdicionado: string): string {
  if (sqlAdicionado === '') {
    return '';
  }

  if (sqlOrigem === '') {
    return `${sqlOrigem} where ${sqlAdicionado}`;
  }

  return `${sqlOrigem} and ${sqlAdicionado}`;
}

export function padLeft(text: string, size: number): string {
  if (text) {
    return (String('0').repeat(size) + text).substr(size * -1, size);
  }
  return '';
}

export function isDate(strDate: string, dateFormat = 'yyyy-MM-dd'): boolean {
  const retorno = parse(strDate, dateFormat, new Date());

  return !!retorno && retorno.toString() !== 'Invalid Date';
}

export function isDateTime(strDate: string, dateFormat = 'yyyy-MM-dd HH:mm'): boolean {
  return isDate(strDate, dateFormat);
}

export function extractDateFuso(date: Date, numeroHoras: number): string {
  const data = addHours(date, numeroHoras);

  let fuso = '+00';
  if (numeroHoras < 0) {
    fuso = `-${padLeft(`${Math.abs(numeroHoras)}`, 2)}`;
  } else {
    fuso = `+${padLeft(`${Math.abs(numeroHoras)}`, 2)}`;
  }
  let dataStrRetorno = data.toJSON();
  dataStrRetorno = dataStrRetorno.replace('T', ' ').replace('Z', '') + fuso;
  return dataStrRetorno;
}

export function strToDate(strDate: string, dateFormat = 'yyyy-MM-dd'): Date | null {
  if (isDate(strDate, dateFormat)) {
    return parse(strDate, dateFormat, new Date());
  }
  return null;
}

export function dateToSql(data: string | Date): string {
  if (typeof data === 'string') {
    data = new Date(data);
  }

  return `'${format(data, 'yyyy-MM-dd')}'`;
}

export function formatDate(date: Date, dateFormat = 'yyyy-MM-dd'): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, dateFormat);
}

export function addMes(date: Date, qtd: number): Date {
  return addMonths(date, qtd);
}

export function primeiroDiaAno(data: Date): Date | null {
  const ano = formatDate(data, 'yyyy');
  return strToDate(`01-01-${ano}`, 'dd-MM-yyyy');
}

export function ultimoDiaAno(data: Date): Date | null {
  const ano = formatDate(data, 'yyyy');
  return strToDate(`31-12-${ano}`, 'dd-MM-yyyy');
}

export function primeiroDiaMes(data: Date): Date | null {
  if (typeof data === 'string') {
    data = new Date(data);
  }

  const mesAno = formatDate(data, 'MM-yyyy');
  return strToDate(`01-${mesAno}`, 'dd-MM-yyyy');
}

export function ultimoDiaMes(data: Date | string): Date {
  if (typeof data === 'string') {
    data = new Date(data);
  }
  return lastDayOfMonth(data);
}

export function formatDateTime(data: Date | null, dateFormat: string): string {
  if (!data) {
    return '';
  }
  return `${format(data, dateFormat)}`;
}

export function execSelect(_sql: any): any {
  // const results = sequelize.query(sql, {
  //   type: Sequelize.QueryTypes.SELECT,
  // });
  // return results;
  return null;
}

export function montaWhere(filtros: any, nomeCampoData: string, adicional: string): string {
  let where = '';

  if (isDate(filtros.dataInicial)) {
    where = addParamSql(where, `${nomeCampoData} >= ${dateToSql(filtros.dataInicial)}`);
  }

  if (isDate(filtros.dataFinal)) {
    where = addParamSql(where, `${nomeCampoData} <= ${dateToSql(filtros.dataFinal)}`);
  }

  if (adicional && adicional !== '') {
    where = addParamSql(where, adicional);
  }

  return where;
}

export function montaPaginacao(page: number, size: number): any {
  if (size) {
    const offset = (page || 0) * size;
    return { offset, size: Number(size) };
  }
  return {};
}

export function checkPassword(_login: string, senha: string, senhaHash: string): boolean {
  // const pass = md5(String(login) + String(senha)).toLowerCase();
  const pass = md5(String(senha)).toLowerCase();
  return pass === senhaHash;
}

export function hashPassword(_login: string, senha: string): string {
  // return md5(String(login) + String(senha)).toLowerCase();
  return md5(String(senha)).toLowerCase();
}

export function geraObjError(
  msgUser: string,
  msgDev?: string,
  arrayDetail?: any[],
  codInternoErro?: number
): any {
  if (arrayDetail && !arrayDetail.forEach) {
    arrayDetail = [arrayDetail];
  }
  return {
    mensagemDesenvolvedor: msgDev || msgUser,
    detalhe: arrayDetail || [msgUser],
    mensagemUsuario: msgUser,
    codInternoError: codInternoErro || CodError.NORMAL,
  };
}

export function cloneObj(obj: any): any | null {
  if (obj !== undefined && obj !== null) {
    return JSON.parse(JSON.stringify(obj));
  }
  return null;
}

export function geraDocumentoAuto(): string {
  const letras = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'X',
    'W',
    'Z',
  ];
  const dataHora = new Date();
  let ano = '';
  const mes = letras[Number(formatDateTime(dataHora, 'MM'))];
  const hora = letras[Number(formatDateTime(dataHora, 'HH'))];

  if (Number(formatDateTime(dataHora, 'yy')) > 23) {
    ano = letras[23 - Number(formatDateTime(dataHora, 'yy'))];
  } else {
    ano = letras[Number(formatDateTime(dataHora, 'yy'))];
  }
  return `AUT-${ano}${mes}${formatDateTime(dataHora, 'dd')}${hora}${formatDateTime(
    dataHora,
    'mmss'
  )}`;
}

export function versionInfo(): any {
  const versionNumber = Number((version || '').replace(/\./g, ''));
  return {
    versionNumber,
    version,
  };
}

export function geraId(valorInt: string): number {
  let retorno = 0;
  let valor = 0;
  let i;
  try {
    for (i = 0; i < valorInt.length; i++) {
      valor = parseInt(`${valorInt.charAt(i)}`, 10);
      valor *= i + 1;
      retorno += valor;
    }
    retorno %= 11;
    if (retorno === 10) retorno = 0;
  } catch (err) {
    return 0;
  }
  return retorno;
}

export function encryptDecryptToken(preToken: string, encrypt: boolean): string {
  if (preToken == null || preToken.trim() === '') {
    return '';
  }
  let key1 = '1472583690';
  const key2 = '0123456789';
  let retorno = '';
  while (key1.length < preToken.length) {
    key1 += key1;
  }
  let posKey = 0;
  try {
    let i;
    if (encrypt) {
      posKey = Math.round(Math.random() * 10);
      key1 = key1.substring(posKey);

      for (i = 0; i < preToken.length; i++) {
        const posChar = key2.indexOf(preToken.charAt(i));
        retorno += key1.charAt(posChar);
      }
      retorno = posKey + retorno;
      retorno = geraId(retorno) + retorno;
    } else {
      const id = parseInt(`${preToken.charAt(0)}`, 10); // pega o id
      preToken = preToken.substring(1);
      if (id !== geraId(preToken)) {
        throw 'Token inválido';
      }
      posKey = parseInt(`${preToken.charAt(0)}`, 10);
      preToken = preToken.substring(1);
      key1 = key1.substring(posKey);
      for (i = 0; i < preToken.length; i++) {
        const posChar = key1.indexOf(preToken.charAt(i));
        retorno += key2.charAt(posChar);
      }
    }
  } catch (err) {
    return '';
  }
  return retorno;
}

export function validaToken(token: string): boolean {
  const tempoMaximo = 720; // 720 min. (12h)
  token = encryptDecryptToken(token, false);
  // SimpleDateFormat simplesformato = new SimpleDateFormat("ddMMyyyyHHmm");
  let data;
  const dataAtual = new Date();
  try {
    // data = simplesformato.parse(token);
    data = strToDate(token, 'ddMMyyyyHHmm');
    if (!data) {
      return false;
    }
  } catch (err) {
    return false;
  }
  const tempo = Math.abs(dataAtual.getTime() - data.getTime()) / (1000 * 60);

  return tempo < tempoMaximo;
}

export function geraToken(): string {
  const dataHora = formatDate(new Date(), 'ddMMyyyyHHmm');
  return encryptDecryptToken(dataHora, true);
}

export function getNow(): Date | null {
  const date = new Date();
  const strDateTime = formatDateTime(date, 'yyyy-MM-dd HH:mm');
  return strToDate(strDateTime, 'yyyy-MM-dd HH:mm');
}

export function deserializeArray(str: string): any | null {
  if (!str || str === '') {
    return null;
  }
  try {
    return JSON.parse(str);
  } catch (err) {
    return null;
  }
}

export function validaCPF(strCPF: string, blankValid = false): boolean {
  if (!strCPF && blankValid) {
    return true;
  }
  strCPF = strCPF.replace(/[^\d]+/g, '');
  let Soma;
  let Resto;
  Soma = 0;
  let i;
  if (!strCPF || strCPF === '00000000000' || strCPF === '') return false;

  for (i = 1; i <= 9; i++) Soma += parseInt(strCPF.substring(i - 1, i), 10) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) Resto = 0;
  if (Resto !== parseInt(strCPF.substring(9, 10), 10)) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma += parseInt(strCPF.substring(i - 1, i), 10) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) Resto = 0;
  if (Resto !== parseInt(strCPF.substring(10, 11), 10)) return false;
  return true;
}

export function validaCNPJ(strCNPJ: string, blankValid = false): boolean {
  if (!strCNPJ && blankValid) {
    return true;
  }

  strCNPJ = strCNPJ.replace(/[^\d]+/g, '');

  if (strCNPJ === '') return false;

  if (strCNPJ.length !== 14) {
    return false;
  }

  // Elimina CNPJs invalidos conhecidos
  if (strCNPJ === '00000000000000') return false;

  // Valida DVs
  let tamanho = strCNPJ.length - 2;
  let numeros = strCNPJ.substring(0, tamanho);
  const digitos = strCNPJ.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  let i;
  for (i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0), 10)) {
    return false;
  }

  tamanho += 1;
  numeros = strCNPJ.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1), 10)) {
    return false;
  }

  return true;
}
