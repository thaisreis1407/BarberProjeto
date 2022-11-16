export class Usuario {
  id: number;
  login: string;
  inativo: boolean ;
  perfil: string;
  senha: string;
}

export class Cliente {
  id: number;
  nome: string;
  telefone: string;
  responsavel: string;
  celular:string;
  ultimoCorte: Date;
  inativo: boolean;
}

export class Fornecedor {
  id: number;
  nome: string;
  telefone: string;
  diaVencimento: Date;
  inativo: boolean;
}

export class Empresa {
  id: number;
  razaoSocial: string;
  fantasia: string;
  numeroContrato: string;
  cnpj: string;
  cnpjFormatado: string;
}

export class Conta {
  id: number;
  descricao: string;
  saldo: number;
}

export class Servico {
  id: number;
  descricao: string;
  valor: number;
}

export class ProdutoServico {
  id: number;
  tipo: number;
  descricao: string;
  valor: number;
  saldo: number;
  custo: number;
  bloqueado: boolean;
}

export class FormaPagamento {
  id: number;
  descricao: string;
  conta: Conta;
  desagio: number;
  padrao: string;
}

export class MovimentacaoConta {
  id: number;
  conta: Conta;
  tipo: string;
  valor: number;
  dataMovimentacao: Date;
  descricao: string;
}

export class Atendente {
  id: number;
  conta: Conta;
  nome: string;
  inativo: boolean;
}

export class DuplicataPagar {
  id: number;
  conta: Conta;
  fornecedor: Fornecedor;
  valor: number;
  dataCompra: Date;
  dataVencimento: Date;
}

export class Agenda {
  id: number;
  atendente: Atendente;
  nome: string;
  intervaloMinutos: number;
  agendaDetalhe: AgendaDetalhe[] = [];
}

export class AgendaDetalhe {
  id: number;
  diaSemana: number;
  horarioInicio: Date;
  horarioFim: Date;
}


export class LicencaInfo {
  empresa: Empresa;
  chaveAdimplencia: string;
  vencimento: Date;
  numeroDispositivos: number;
  ativada: boolean;
  diasParaVencer: number;
}

export class Agendamento {
  id: number;
  idAgenda: number;
  data: Date;
  hora: Date;
  cliente: Cliente;
  atendente: Atendente;
  status: string;
  observacao: string;
  atendimento: Atendimento;
}

export class Entrada {
  id: number;
  produtoServico: ProdutoServico;
  dataEntrada: Date;
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
}

export class Atendimento {
  id: number;
  formaPagamento: FormaPagamento;
  dataInicio: Date;
  horaInicio: Date;
  dataFim: Date;
  horaFim: Date;
  valorTotal: number;
  obs: string;
  atendimentoDetalhe: AtendimentoDetalhe[];
}

export class AtendimentoDetalhe {
  id: number;
  produtoServico: ProdutoServico;
  tipoProdutoServico: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}
