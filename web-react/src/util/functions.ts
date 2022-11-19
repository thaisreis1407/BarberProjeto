/* eslint-disable no-throw-literal */
/* eslint-disable no-use-before-define */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-cycle */
/* eslint-disable no-bitwise */
/* eslint-disable no-restricted-globals */

/**
 * Funçoes globais do App
 * @module functions
 * @category Utils
 */

import {
  format,
  parse,
  addDays,
  differenceInMinutes,
  lastDayOfMonth,
  lastDayOfWeek,
  addMonths,
  intervalToDuration,
  addHours,
} from 'date-fns';
import jwt from 'jsonwebtoken';
// import queryString from 'query-string';
import { toast } from 'react-toastify';

import { StateScreen } from '../pages/constants';
// import { store } from '../store';
// import { showDialogLogin } from '../store/modules/dialog/actions';

/**
 * Formata um número no padrão pt-BR
 * @func formatCurr
 * @param {number} value Número a ser formatado
 * @returns {string} Retorna uma string com o número formatado
 */
export const { format: formatCurr } = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/**
 * Formata um número no padrão pt-BR
 * @param {number} value Número a ser formatado
 * @param {number} digits Dígitos decimais, default 2
 * @returns {string} Retorna uma string com o número formatado
 */
export function formatFloat(value: number, digits = 2) {
  const f = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return f.format(value);
}

/**
 * Remove caracteres de um número de telefone retornando apenas números
 * @param {string} fone
 * @returns {string} Retorna uma string apenas com números
 */
export function extractFoneNumber(fone: string) {
  if (!fone) {
    return '';
  }
  return fone.replace(/\(/g, '').replace(/\)/g, '').replace(/ /g, '').replace(/-/g, '');
}

/**
 * Retorna a extensão do arquivo conforme o content type
 * @param {string} contentType Content-Type do a ser verificado
 * @returns {string} Retorna uma string contendo a expansão do arquivo
 */
export function extensaoFile(contentType: string) {
  switch (contentType) {
    case 'application/x-rar-compressed':
      return 'rar';
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'application/pdf':
      return 'pdf';
    case 'application/x-7z-compressed':
      return '7z';
    case 'application/zip':
      return 'zip';
    default:
      return 'file';
  }
}

/**
 * Converte uma arquivo b64Data em Blob
 * @param {string} b64Data Dados em base64
 * @param {string} contentType Content type do arquivo
 * @param {number} sliceSize size
 * @returns Blob contendo dados do arquivo
 */
export function b64toBlob(
  b64Data: string,
  contentType = 'application/pdf',
  sliceSize = 512
): Blob {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

/**
 * Formata uma data conforme o dateFormat
 *
 * @param {Date} date Data em formato Date ou String
 * @param {string} dateFormat Formato a ser usado, default yyyy-MM-dd
 * @returns {string} Retorna uma string contendo a data formatada.
 */
export function formatDate(date: string | Date | undefined, dateFormat = 'yyyy-MM-dd') {
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    if (date.length <= 10) {
      date += 'T00:00:00'; // evitar problema com fuso-horário
    }

    date = new Date(date);
  }

  return format(date, dateFormat);
}

/**
 * Extrai a parte da data de um Date. Devolve uma string no formato yyyy-mm-dd
 * @param {Date} data Data base que será usada
 * @returns {string} Devolve uma string no formato yyyy-mm-dd
 */
export function extractDateStrFromDate(data: Date) {
  if (!data) {
    return '';
  }
  if (!data.getTime) {
    return '';
  }
  const strIsoDate = data.toISOString();
  return strIsoDate.substring(0, 10);
}

/**
 * Extrai a parte da hora de um Date. Devolve uma string no formato hh:mm ou hh:mm:ss
 * @param {Date} data Data base que será usada
 * @param {boolean} ignoraSegundos Flag que indica se é para considerar segundos ou não
 * @returns {string} Devolve uma string no formato hh:mm ou hh:mm:ss
 */
export function extractTimeStrFromDate(data: Date, ignoraSegundos = false) {
  if (!data) {
    return '';
  }
  if (!data.getTime) {
    return '';
  }
  const strIsoDate = data.toISOString();
  return strIsoDate.substring(11, ignoraSegundos ? 16 : 19);
}

/**
 * Adicionada uma quantidade de meses em uma data
 *
 * @param {Date} date Data em que os meses serão adicionadas
 * @param {number} qtd Quantidade de meses a serem adicionadas
 * @returns {string} Retorna a data adicionada o número de meses
 */
export function addMes(date: Date, qtd: number) {
  return addMonths(date, qtd);
}

/**
 * Cria um Date com horário de 00:00
 *
 * @returns {date} Retorna uma data com horário de 00:00 usando o timezone do servidor
 */
export function newDateOnly() {
  const date = formatDate(new Date(), 'yyyy-MM-dd');
  return new Date(`${date}T${padLeft(getTimeZoneOffSet().toString(), 2)}:00:00.000Z`);
}

/**
 * Cria um Date com horário de 00:00
 *
 * @returns {date} Retorna uma data com horário de 00:00 usando o timezone do servidor
 */
export function newDateTimeEndOnly(): Date {
  const date = formatDate(new Date(), 'yyyy-MM-dd');
  return new Date(`${date}T${padLeft(getTimeZoneOffSet().toString(), 2)}:00:00.000Z`);
}

/**
 * Cria um Date com horário de 00:00
 *
 * @returns {date} Retorna uma data com horário de 00:00 usando o timezone do servidor
 */
export function newDateTimeStartOnly(): Date {
  const date = formatDate(new Date(), 'yyyy-MM-dd');
  return new Date(`${date}T${padLeft((23 - getTimeZoneOffSet()).toString(), 2)}:00:00.000Z`);
}

/**
 * Calcula a altura do grafico conforme a quantidade de registros
 * @param {number} nRecord Número de registros
 * @returns {number} Retorna a altura
 */
export function calcHeightGraphiFromRecords(nRecord: number): number {
  let h = 50;
  const fator = isScreenMobile() ? 16.0 : 13.0;

  if (isNumber(nRecord)) {
    h = Number(nRecord) * fator;
  }
  if (h < 50) {
    h = 50;
  }

  return h;
}

/**
 * Função que retorna apenas a hora de um date
 * @param {string} strTime String contendo uma data
 * @param {boolean} ignoreSeconds Flag que indica se é para ignorar ou não os segundos
 * @returns {date} Retorna um Date contendo uma data 1970-01-01 mais a hora
 */
export function newTimeOnly(strTime: Date, ignoreSeconds = false): Date {
  let dateLocal;
  let timeUTC;
  if (strTime) {
    dateLocal = new Date(`1970-01-01T${strTime}.000Z`);
    timeUTC = addHours(dateLocal, 2 * getTimeZoneOffSet());
  } else {
    dateLocal = new Date();
    timeUTC = addHours(dateLocal, getTimeZoneOffSet());
  }

  if (!ignoreSeconds) {
    const time = formatDate(timeUTC, 'HH:mm:ss');
    return new Date(`1970-01-01T${time}.000Z`);
  }
  const time = formatDate(timeUTC, 'HH:mm');
  return new Date(`1970-01-01T${time}:00.000Z`);
}

/**
 * Retorna apenas a hora de uma date
 * @returns {date} Retorna uma data
 */
export function newDateTimeHourOnly(): Date {
  const dateLocal = new Date();
  const timeUTC = addHours(dateLocal, getTimeZoneOffSet());
  const dateNow = dateLocal.toISOString().substring(0, 10);

  const time = formatDate(timeUTC, 'HH');
  return new Date(`${dateNow}T${time}:00:00.000Z`);
}

/**
 * Retorna um date contendo a data 1979-01-01 a hora enviada como parâmetro
 * @param {string} strTime Data/hora em formato string ou date
 * @returns {date}
 */
export function newTimeHourOnly(strTime: Date): Date {
  let dateLocal;
  let timeUTC;
  if (strTime) {
    dateLocal = new Date(`1970-01-01T${strTime}.000Z`);
    timeUTC = addHours(dateLocal, 2 * getTimeZoneOffSet());
  } else {
    dateLocal = new Date();
    timeUTC = addHours(dateLocal, getTimeZoneOffSet());
  }

  const time = formatDate(timeUTC, 'HH');
  return new Date(`1970-01-01T${time}:00:00.000Z`);
}

/**
 * Converte uma string que contem uma data em uma Date
 *
 * @param {string} strDate Data em formato string
 * @param {string} dateFormat Formato da data, default yyyy-MM-dd
 * @returns {date} Retorna um Date gerado pelo parametro enviado
 */
export function strToDate(strDate: string, dateFormat = 'yyyy-MM-dd'): Date | null {
  if (strDate && strDate.length >= 24) {
    return new Date(strDate);
  }
  if (isDate(strDate, dateFormat)) {
    return parse(strDate, dateFormat, new Date());
  }
  return null;
}

/**
 * Retorna o primeiro dia do ano de uma date
 * @param {Date} date que de deseja extrair o primeiro dia do ano
 * @returns Retorna umd Date contendo o primeiro dia do ano contino no date enviado por parâmetro
 */
export function firstDayYear(date: Date): Date | null {
  const yean = formatDate(date, 'yyyy');
  return strToDate(`01-01-${yean}`, 'dd-MM-yyyy');
}

/**
 * Retorna o último dia do ano de uma date
 * @param {Date} date que de deseja extrair o último dia do ano
 * @returns Retorna umd Date contendo o último dia do ano contino no date enviado por parâmetro
 */
export function lastDayYear(date: Date): Date | null {
  const year = formatDate(date, 'yyyy');
  return strToDate(`31-12-${year}`, 'dd-MM-yyyy');
}
/**
 * Concatena uma data com um hora.
 * @param {Date} date Data a ser concatenada
 * @param {Date} time Hora a ser concatenada
 * @returns Retorna um Date concatenada com data e hora
 */
export function concatDateAndTime(date: Date, time: Date): Date {
  const dateTime = `${
    date.toISOString().substring(0, 11) + time.toISOString().substring(11, 16)
  }:00.000Z`;
  return new Date(dateTime);
}

/**
 * Retorna o primeiro dia do mês
 * @param {Date} date Data base para cálculo
 * @returns {Date} Retorna o primeiro dia do mês conforme data base
 */
export function firstDayMonth(date: Date): Date | null {
  const monthYear = formatDate(date, 'MM-yyyy');

  return strToDate(`01-${monthYear}`, 'dd-MM-yyyy');
}

/**
 * Retorna o último dia do mês
 * @param {Date} date Data base para cálculo
 * @returns {Date} Retorna o último dia do mês conforme data base
 */
export function lastDayMonth(date: Date): Date {
  return lastDayOfMonth(date);
}

/**
 * Retorna o último dia da semana
 * @param {Date} date
 * @param {boolean} SundayFirstDay Flag que indica se deseja considerar o domingo como primeiro dia
 * @returns {Date} Retorna o dia da semana
 */
export function lastDayweek(date: Date, SundayFirstDay = true): Date {
  const lasDay = lastDayOfWeek(date);
  const day = SundayFirstDay ? 1 : 0;
  return addDays(lasDay, day);
}

/**
 * Retorna o primeiro dia da semana
 * @param {Date} date
 * @param {boolean} SundayFirstDay Flag que indica se deseja considerar o domingo como primeiro dia
 * @returns {Date} Retorna o dia da semana
 */
export function firstDayweek(date: Date, SundayFirstDay = true): Date {
  const lastDia = lastDayweek(date, SundayFirstDay);
  return addDays(lastDia, -7);
}

/**
 * Valida se uma string contem uma data válida conforme o formado desejado
 * @param {string} strDate String que poderá conter a data
 * @param {string} dateFormat Formato de data a ser usado. Default yyy-MM-dd
 * @returns Retorna True se a data for válida
 */
export function isDate(strDate: string, dateFormat = 'yyyy-MM-dd'): boolean {
  const retorno = parse(strDate, dateFormat, new Date());
  return !!retorno && retorno.toString() !== 'Invalid Date';
}

/**
 * Calcula a idade baseado em data de nascimento e data atual.
 *
 * @param {Date|string} dataAtual Data atual
 * @param {Date|string} dataNascimento Data de nascimento
 * @returns [number, number] Retorna uma array [anos, meses, dias]
 */
export function calculaIdadeIdade(dataAtual?: Date, dataNascimento?: Date) {
  const dAtual = typeof dataAtual === 'string' ? strToDate(dataAtual) : dataAtual;
  const dNascimento =
    typeof dataNascimento === 'string' ? strToDate(dataNascimento) : dataNascimento;

  if (dAtual && dNascimento) {
    const { years, months, days } = intervalToDuration({
      start: dNascimento,
      end: dAtual,
    });

    return [years || 0, months || 0, days || 0];
  }
  return [];
}

/**
 * Calcula a idade baseado em data de nascimento e data atual.
 * Devolve a idade no formato "10 anos, 3 meses e 20 dias"
 *
 * @param dataAtual Data atual
 * @param dataNascimento Data de nascimento
 * @returns {string} Retorna uma string no formato "x anos, y meses e z dias"
 */
export function calculaIdadeTexto(dataAtual?: Date, dataNascimento?: Date): string {
  if (!dataAtual || !dataNascimento) {
    return 'Não informada';
  }
  const [anos, meses, dias] = calculaIdadeIdade(dataAtual, dataNascimento);

  let retorno = '';
  if (anos > 0) {
    if (anos > 1) {
      retorno += `${anos} anos`;
    } else {
      retorno += `${anos} ano`;
    }
  }

  if (retorno) {
    retorno += ', ';
  }

  if (meses > 1) {
    retorno += `${meses} meses`;
  } else {
    retorno += `${meses} mês`;
  }

  if (retorno) {
    retorno += ' e ';
  }

  if (dias > 1) {
    retorno += `${dias} dias`;
  } else {
    retorno += `${dias} dia`;
  }

  return retorno;
}

/**
 * Retorna o Offset de um time zone
 * Exemplo: se for fuso de Brasilia, retorna -3, Manaus retorna -4, ...
 *
 * @returns {number} Retorna o offset de um timezone
 */
export function getTimeZoneOffSet() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return offset / 60;
}

/**
 * Gera recebe um objeto de filtros e gera filtros em formato de query params
 * @param {Object} filtros Objeto contendo os filtros
 * @param {boolean} aceitaVazio Flag que indica se o aceita parâmetros vazios ou não
 * @returns {string}
 */
export function geraFiltroHttp(filtros: any, aceitaVazio = true): string {
  if (!filtros) return '';
  let retorno = '';

  const filters = cloneObj(filtros);

  const offset = getTimeZoneOffSet();

  filters.timeZoneOffSet = offset;

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && typeof value === 'string') {
      if (aceitaVazio && value.trim() === '') {
        value = null;
      }
    }

    if (value !== undefined && typeof value === 'boolean') {
      if (aceitaVazio) {
        value = String(value);
      }
    }

    if (value) {
      if (retorno === '') {
        retorno += `?${key}=${value}`;
      } else {
        retorno += `&${key}=${value}`;
      }
    }
  });

  return retorno;
}

/**
 * Verifica se o dispositivo onde a aplicação está sendo executada é ou não Mobile
 * @returns {boolean}
 */
export function isMobile(): boolean {
  return window.innerWidth <= 1024;
}

/**
 * Devolve uma promisse que se resolve em um determinado de tempo
 *
 * @param {number} ms Tempo em milessegundos
 * @returns {Promise<any>} Retona uma Promise void
 */
export function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Recebe um error e converte em mensagems amigável para o usuário
 * @param {Object | string} error Erro a ser tratado
 */
export function errorHandle(error: any): void {
  let msg = '';

  if (typeof error === 'string') {
    msg = error;
  } else if (typeof error === 'object') {
    if (error.tokenExpired) {
      msg = 'Seu acesso expirou, é necessário fazer login';
      // store.dispatch(showDialogLogin());
    } else if (error.response) {
      if (
        error.response.data &&
        error.response.data.error &&
        typeof error.response.data.error === 'string'
      ) {
        if (error.response.data.error_description) {
          msg = error.response.data.error_description;
        } else {
          msg = error.response.data.error;
        }
      } else if (error.response.status === 404) {
        msg = `404 - Recurso não encontrato no servidor.`;
      } else if (error.response.status === 400) {
        msg = '400 - Requisição inválida';
      } else if (error.response.status === 401) {
        msg = '401 - Não autorizado';
      } else if (error.response.status === 405) {
        msg = '405 - Método não permitido';
      } else if (error.response.status === 403) {
        msg = '403 - Você não tem permissão para executar esta ação';
      }

      if (
        error.response.data &&
        error.response.data.mensagemUsuario &&
        error.response.data.mensagemUsuario !== ''
      ) {
        msg = error.response.data.mensagemUsuario;
      } else if (msg === '') {
        msg = 'Não foi possível processar ação. Verifique sua conexão e tente novamente';
      }
    } else {
      msg = error.toString();
    }
  } else {
    msg = 'Não foi possível processar ação. Verifique sua conexão e tente novamente.';
  }
  if (msg === '') {
    msg = 'Não foi possível processar ação. Verifique sua conexão e tente novamente.';
  }

  if (error?.response?.data?.mensagemDesenvolvedor) {
    console.error(
      `msg dev: ${error?.response?.data?.mensagemDesenvolvedor}`,
      error?.response?.data.detalhe
    );
  } else {
    console.error(`msg dev: ${msg}`);
  }
  toast.error(msg);
}

/**
 * Gera um UUID
 * @returns {string} Retorna uma string contendo um UUID
 */
export function generateUUID(): string {
  // Public Domain/MIT
  let d = new Date().getTime(); // Timestamp
  let d2 =
    (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; // Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16; // random number between 0 and 16
    if (d > 0) {
      // Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Verifica se um val tipo Any é um número válido
 * @param {string} val Valor Any que pode conter o valor numérico
 * @returns {boolean} Retorna true se o val for um número válido
 */
export function isNumber(val: any): boolean {
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(val);
}

/**
 * @typedef {Object} RPageParams
 * @property {string} stateScreen Status de tela encontrado em StateScreen
 * @property {number} idSelected Id selecionado
 * @property {string} toBack String contendo o caminho de volta se existir
 */
/**
 * Recebe params http e search e retorna um objeto contendo stateScree, idSelected e toBack
 * @param {any} params Http parametros
 * @param {any} search search parametros
 * @return
 */
export function getPageParams(params: any, search: any): any {
  const { option } = params;
  // const options = queryString.parse(search);
  // const { toBack, view } = search;
  const toBack = search.get('toBack') || '';
  const view = search.has('view');

  // const view = options.view !== undefined;
  let stScreen = StateScreen.stSearch;
  let idSelected = 0;

  if (isNumber(option)) {
    if (view) {
      stScreen = StateScreen.stView;
      idSelected = Number(option);
    } else {
      idSelected = Number(option);
      stScreen = StateScreen.stUpdate;
    }
  } else if (option === 'insert') {
    stScreen = StateScreen.stInsert;
  }

  return {
    stateScreen: stScreen,
    idSelected,
    toBack,
  };
}

/**
 * Clona um objeto usando JSON
 * @param {Object} obj Objeto a ser clonado
 * @returns {Object} Clone do objeto enviado via parâmetro
 */
export function cloneObj(obj: any) {
  if (obj !== undefined && obj !== null) {
    return JSON.parse(JSON.stringify(obj));
  }
  return null;
}
/**
 * Retorna o próximo elemento prevNext após ou antes do elemento localValue da array enviada
 * @param {Array} array Array onde será extraida o elemento
 * @param {any} localValue Elemento usado como base
 * @param {number} prevNext Número positivo ou negativo indicando a posição relativa ao elemento localValue
 * @returns {any | null} Retorna o elemento da array ou null se não encontrado
 */
export function getElementArray(array: any[], localValue: any, prevNext: number): any | null {
  let i = -1;
  for (let x = 0; x < array.length; x++) {
    if (array[x].value === localValue.value) {
      i = x;
      break;
    }
  }

  if (i >= 0 && i + prevNext < array.length && i + prevNext >= 0) {
    return array[i + prevNext];
  }
  return null;
}

/**
 * Calcula a diferença em minutos entre dois objetos Dates
 * @param {Date} dateFinal
 * @param {Date} dateInicial
 * @returns {number} Retorna o número de minutos referente ã diferença entre os Dates
 */
export function getDiferencaEmMinutos(dateFinal: Date, dateInicial: Date): number {
  return differenceInMinutes(dateFinal, dateInicial);
}

/**
 * Valida os fields de um Object conforme lista de fields
 * @param {Object} obj Objeto a ser validado
 * @param {string| string[]} fields Field(s) a serem validados
 * @returns {boolean} Retorna true se não ocorrer erros de validação
 */
export function validateFields(obj: any, fields: string | string[]) {
  const array = fields && Array.isArray(fields) ? fields : [fields];

  let ret = false;
  if (obj && typeof obj === 'object') {
    if (array && array.length > 0) {
      ret = true;
      array.forEach((e) => {
        if (e !== '') {
          if (obj[e] !== null && obj[e] !== undefined) {
            if (typeof obj[e] === 'string' && obj[e] === '') {
              ret = false;
            } else if (typeof obj[e] === 'number' && obj[e] <= 0) {
              ret = false;
            } else if (typeof obj[e] === 'object' && !obj[e]) {
              ret = false;
            } else if (typeof obj[e] === 'bigint' && obj[e] <= 0) {
              ret = false;
            } else if (typeof obj[e] === 'undefined') {
              ret = false;
            }
          } else {
            ret = false;
          }
        }
      });
    }
  }

  return ret;
}
/**
 * Valida CPF
 * @param {string} strCPF CPF a ser validado
 * @param {boolean} blankValid Flag que define se é para validar CPFs vazios
 * @returns {boolean} Retorna true se for valido
 */
export function validCPF(strCPF: string, blankValid = false): boolean {
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

/**
 * Valida CNPJ
 * @param {string} strCNPJ CNPJ a ser validado
 * @param {boolean} blankValid Flag que define se é para validar CNPJs vazios
 * @returns {boolean} Retorna true se for valido
 */
export function validCNPJ(strCNPJ: string, blankValid = false): boolean {
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

/**
 * Adiciona espaçoes à esquerda de uma texto
 *
 * @param {string} text Texto base
 * @param {number} size Quantidade de espaçoes a serem adicionados
 * @returns {string} Retorna uma string com os espaços adicionados
 */
export function padLeft(text: string, size: number): string {
  if (text) {
    return (String('0').repeat(size) + text).substr(size * -1, size);
  }
  return '';
}
/**
 * Valida se é um array
 * @param array
 * @returns {boolean}
 */
export function isValidArray(array: any): boolean {
  return array && typeof array.map === 'function';
}

/**
 * Valida se a tela é mobile ou não
 * @returns {boolean}
 */
export function isScreenMobile() {
  return window.innerHeight < 480 || window.innerWidth < 640;
}

/**
 * Calcula a quantidade máxima de registros que cabe em uma página
 * conforme o tamanho da tela
 * @param {number} qt768 Quantidade que cabem em resolução de 768 de altura
 * @param {number} qt900 Quantidade que cabem em resolução de 900 de altura
 * @param {number} qt1080 Quantidade que cabem em resolução de 1080 de altura
 * @param {number} qtMobile Quantidade que cabem em resolução de telefone
 * @returns {number} Retorna a quantidade de registros
 */
export function calcNaxItemsPage(
  qt768: number,
  qt900: number,
  qt1080: number,
  qtMobile?: number
) {
  const mobile = window.innerHeight < 480 || window.innerWidth < 640;

  if (mobile) {
    return qtMobile || 5;
  }

  let qtdRegs = qt768;
  if (screen.height >= 850 && screen.height <= 950) {
    qtdRegs = qt900;
  } else if (screen.height > 950) {
    qtdRegs = qt1080;
  }

  if (!isNumber(qtdRegs)) {
    return 11;
  }
  return qtdRegs;
}

/**
 * Converte uma string contendo número formatado em pt-BR para um number
 * @param {string} srtNumber String a ser convertida
 * @param {number | undefined} valDefault Valor padrão caso não seja possível converter
 * @returns {number} Número resultante
 */
export function strNumBrToNumber(srtNumber: string, valDefault?: number) {
  if (typeof srtNumber === 'number') {
    return srtNumber;
  }
  if (!srtNumber || srtNumber.trim() === '') {
    return valDefault;
  }
  const sNumber = srtNumber.replace(/\./g, '').replace(/,/g, '.');
  if (isNumber(sNumber)) {
    return Number(sNumber);
  }
  return valDefault;
}

/**
 * Aguarda até que um documento seja carregado
 * @param {any} document Document a ser verificado
 * @param {number} timeout Timeout que será aguardado até que o documento seja carregado
 * @returns
 */
export async function documentReady(document: any, timeout = 5): Promise<true | undefined> {
  for (let i = 0; i < timeout; i++) {
    if (document.readyState === 'complete') {
      return true;
    }
    await sleep(1000);
  }
}

/**
 * Salva um grafico em disco
 * @param {any} graphicRef Referência do gráfico
 * @param {string} filename String contendo o nome do arquivo
 */
export async function saveGraphic(graphicRef: any, filename: any) {
  const a = document.createElement('a');

  a.href = graphicRef.current.chart.toBase64Image();
  a.download = `${filename}.png`;
  a.click();
}

export function getDecodedToken(token: string): any {
  const decoded: any = jwt.decode(token);

  const dateValidade = new Date(decoded.exp * 1000);
  const dateNow = new Date();

  if (dateNow > dateValidade) {
    throw 'Data Inválida';
  }
  return decoded;
}
