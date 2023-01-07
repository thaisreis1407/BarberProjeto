export class UsuarioModel {
  id = undefined;
  inativo = false;
  login = '';
  perfil = '';
  senha = '';
}

export class ClienteModel {
  id = undefined;
  nome = '';
  telefone = '';
  responsavel = '';
  celular = '';
  ultimoCorte = undefined;
  inativo = false;
}

export class FornecedorModel {
  id = undefined;
  nome = '';
  telefone = '';
  diaVencimento = undefined;
  inativo = false;
}

export class EmpresaModel {
  id = undefined;
  razaoSocial = '';
  fantasia = '';
  numeroContrato = '';
  cnpj = '';
  cnpjFormatado = '';
}

export class ContaModel {
  id = undefined;
  descricao = '';
  saldo = 0;
}

export class ServicoModel {
  id = undefined;
  descricao = '';
  valor = 0;
}

export class ProdutoServicoModel {
  id = undefined;
  tipo = 1;
  descricao = '';
  valor = 0;
  saldo = 0;
  custo = 0;
  bloqueado = false;
}

export class FormaPagamentoModel {
  id = undefined;
  idConta: undefined;
  descricao = '';
  conta = new ContaModel();
  desagio = 0;
  padrao = false;
}

export class MovimentacaoContaModel {
  id = undefined;
  conta = new ContaModel();
  tipo = '';
  valor = 0;
  dataMovimentacao = new Date();
  descricao = '';
}

export class AtendenteModel {
  id = undefined;
  idContaComissao: undefined;
  conta = new ContaModel();
  nome = '';
  inativo = false;
}

export class DuplicataPagamentoModel {
  id = undefined;
  id_conta = undefined;
  id_movimentacao_conta = undefined;
  data_pagamento = new Date();
  valor = 0;
  observacao = '';
}

export class DuplicataPagarModel {
  id = undefined;
  idFornecedor = undefined;
  fornecedor = new FornecedorModel();
  valor = 0;
  valorRecebido = 0;
  dataCompra = new Date();
  dataVencimento = new Date();
  duplicataPagamento: DuplicataPagamentoModel[] = [];
  status = 0;
  observacao = '';
}

export class AgendaDetalheModel {
  id = undefined;
  diaSemana? = 0;
  horarioInicio = new Date();
  horarioFim = new Date();
}

export class AgendaModel {
  id = undefined;
  atendente = new AtendenteModel();
  idAtendente: undefined;
  nome = '';
  intervaloMinutos = 0;
  agendaDetalhe: AgendaDetalheModel[] = [];
}

export class AgendamentoModel {
  id = undefined;
  idAgenda = 0;
  data = new Date();
  hora = new Date();
  cliente = ClienteModel;
  atendente = new AtendenteModel();
  status = '';
  observacao = '';
  atendimento = new AtendimentoModel();
}

export class EntradaModel {
  id = undefined;
  produtoServico = new ProdutoServicoModel();
  dataEntrada = new Date();
  valorUnitario = 0;
  quantidade = 0;
  valorTotal = 0;
}

export class AtendimentoModel {
  id = undefined;
  formaPagamento = new FormaPagamentoModel();
  dataInicio = new Date();
  horaInicio = new Date();
  dataFim = new Date();
  horaFim = new Date();
  valorTotal = 0;
  obs = '';
  atendimentoDetalhe: AtendimentoDetalheModel[] = [];
}

export class AtendimentoDetalheModel {
  id = undefined;
  produtoServico = new ProdutoServicoModel();
  tipoProdutoServico = 0;
  quantidade = 0;
  valorUnitario = 0;
  valorTotal = 0;
}
