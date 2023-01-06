/**
 * Módulo de constantes usadas na plataforma, como URL base, nome das rotas, e outros
 * @module Constantes
 * @category config
 */

/**
 * Retorna a URL base para conexão com a API
 * @returns {string}
 */
const getBaseURL = (): string => {
  if (window.location.hostname !== '') {
    let apiPort = process.env.NODE_ENV === 'development' ? 7000 : 7000;
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:8000';
    }

    if (window.location.hostname.includes('teste.')) {
      apiPort = 4955;
    }
    return `${window.location.protocol}//${window.location.hostname}:${apiPort}`;
    // return 'http://teste.telessaude.speedysistemas.com.br:4955';
  }
  return '';
};

/**
 * Retorna um objeto de configuração da API contendo a URL base e os nomes das rotas
 * @const
 */
export const ConfigApi = {
  baseURL: getBaseURL(),

  // URLs
  UsuarioURL: 'usuarios',
  apiInfoURL: 'apiInfo',
  AgendaURL: 'agendas',
  AgendamentoURL: 'agendamentos',
  AtendenteURL: 'atendentes',
  ClienteURL: 'clientes',
  ContaURL: 'contas',
  DuplicataPagarURL: 'duplicatasPagar',
  EntradaPagarURL: 'entradas',
  FormaPagamentoURL: 'formasPagamento',
  FornecedorURL: 'fornecedores',
  MovimentacaoContaURL: 'movimentacoesContas',
  ProdutoServicoURL: 'produtosServicos',
  ServicoURL: 'servicos',
};

/**
 * Tipos de filter INTEGER: 1, DECIMAL: 2, TEXT: 0, DATE: 3
 * @const filterType
 */
export const filterType = {
  INTEGER: 1,
  DECIMAL: 2,
  TEXT: 0,
  DATE: 3,
};

/**
 * Configuração para o componente de calendário
 * @const cfgPtBr
 */
export const cfgPtBr = {
  firstDayOfWeek: 0,
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  dayNamesMin: ['Do', 'Seg', 'Te', 'Qua', 'Qui', 'Sex', 'Sa'],
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  today: 'Hoje',
  clear: 'Limpa',
};

/**
 * @typedef Ufs
 * @property {string} value
 * @property {string} label
 */

/**
 * Lista de tipos de Uf no formato {label: string, value: string }
 * @const {Ufs[]} listaUfs
 */
export const listaUfs = [
  { label: 'AC', value: 'AC' },
  { label: 'AL', value: 'AL' },
  { label: 'AP', value: 'AP' },
  { label: 'AM', value: 'AM' },
  { label: 'BA', value: 'BA' },
  { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' },
  { label: 'ES', value: 'ES' },
  { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' },
  { label: 'MT', value: 'MT' },
  { label: 'MS', value: 'MS' },
  { label: 'MG', value: 'MG' },
  { label: 'PA', value: 'PA' },
  { label: 'PB', value: 'PB' },
  { label: 'PR', value: 'PR' },
  { label: 'PE', value: 'PE' },
  { label: 'PI', value: 'PI' },
  { label: 'RJ', value: 'RJ' },
  { label: 'RN', value: 'RN' },
  { label: 'RS', value: 'RS' },
  { label: 'RO', value: 'RO' },
  { label: 'RR', value: 'RR' },
  { label: 'SC', value: 'SC' },
  { label: 'SP', value: 'SP' },
  { label: 'SE', value: 'SE' },
  { label: 'TO', value: 'TO' },
];

export const listaDiasVencimento = [
  { label: 'Sem dia Definido', value: 100 },
  { label: 'Toda Segunda', value: 101 },
  { label: 'Toda Terça', value: 102 },
  { label: 'Toda Quarta', value: 103 },
  { label: 'Toda Quinta', value: 104 },
  { label: 'Toda Sexta', value: 105 },
  { label: 'Todo Sábado', value: 106 },
  { label: 'Dia 01', value: 1 },
  { label: 'Dia 05', value: 5 },
  { label: 'Dia 10', value: 10 },
  { label: 'Dia 15', value: 15 },
  { label: 'Dia 20', value: 20 },
  { label: 'Dia 25', value: 25 },
  { label: 'Dia 30', value: 30 },
];

export const listaPerfis = [
  { label: 'Administrador', value: 'ADMINISTRADOR' },
  { label: 'Gerente', value: 'GERENTE' },
  { label: 'Funcionário', value: 'FUNCIONARIO' },
  { label: 'Cliente', value: 'CLIENTE' },
];
