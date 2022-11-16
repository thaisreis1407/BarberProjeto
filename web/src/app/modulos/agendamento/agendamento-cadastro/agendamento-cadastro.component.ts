import { AtendimentoDetalhe } from './../../../core/model';
import { ProdutoServicoService } from 'src/app/servicos/produto-servico.service';
import { FormaPagamentoService } from './../../../servicos/forma-pagamento.service';
import { ConfigService } from './../../../shared/config.service';
import { AtendenteService } from 'src/app/servicos/atendente.service';
import { ClienteService } from 'src/app/servicos/cliente.service';

import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/components/common/api';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AuthService } from 'src/app/seguranca/auth.service';
import { MensagemService } from 'src/app/shared/mensagem.service';
import { UtilService } from 'src/app/shared/util.service';
import { Agendamento, ProdutoServico } from 'src/app/core/model';
import { AgendamentoService } from 'src/app/servicos/agendamento.service';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-agendamento-cadastro',
  templateUrl: './agendamento-cadastro.component.html',
  styleUrls: ['./agendamento-cadastro.component.css']
})
export class AgendamentoCadastroComponent implements OnInit {
  agendamentos = [];
  listaStatus = [];
  modoConsulta = false;
  listaAtendentes = [];
  listaClientes = [];
  listaFormasPagamento = [];
  listaProdutosServicos = [];
  produtoSelecionado: ProdutoServico;
  quantidadeSelecionada = 1;
  valorUnitarioSelecionado = 0;
  valorTotalSelecionado = 0;
  indexItemSelecionado = -1;
  statusOriginal = '';

  agendamento: Agendamento;
  cfgPtBr: any;
  @ViewChild('txtQuantidade') txtQuantidade: ElementRef;

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private agendamentoService: AgendamentoService,
    private utilService: UtilService,
    private configService: ConfigService,
    private atendenteService: AtendenteService,
    private clienteService: ClienteService,
    private formaPagamentoService: FormaPagamentoService,
    private produtoServicoService: ProdutoServicoService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idAgendamento = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idAgendamento) {
        this.agendamento = new Agendamento();
        this.carregarLancamento(idAgendamento);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('Agendamento');
    this.carregaAtendentes();
    this.carregaClientes();
    this.carregaFormasPagamento();
    this.carregaProdutosServicos();
    this.listaStatus = [
      {label: 'Agendado', value: 'A'},
      {label: 'Em Atendimento', value: 'E'},
      {label: 'Concluído', value: 'C'},
      {label: 'Faturado', value: 'F'} ];
    this.indexItemSelecionado = -1;
  }

  private carregarLancamento(id: number) {
    this.agendamentoService.buscarPorId(id)
      .then(agendamento => {
        this.agendamento = agendamento;
        this.statusOriginal = this.agendamento.status;
        if (agendamento.status !== 'A') {
          if (this.listaStatus[0].value === 'A') {
            this.listaStatus.splice(0, 1);
          }
        }
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.agendamento = new Agendamento();
    this.agendamento.id = 0;
    this.agendamento.status = 'A';
    this.agendamento.data = new Date();
    this.agendamento.hora = new Date();
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/agendamentos']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/agendamentos']);
        }
      });
    }
  }

  confirmarDados(form: FormControl) {
    this.confirmation.confirm({
      message: 'Confirma dados?',
      accept: () => {
        this.salvar(form);
      }
    });
  }

  salvar(form: FormControl) {
    if (this.agendamento.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.agendamentoService.adicionar(this.agendamento)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/agendamentos']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.agendamentoService.atualizar(this.agendamento)
    .then(agendaAtualizada => {
      this.agendamento = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/agendamentos']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.agendamento.id);
  }

  carregaAtendentes() {
    this.atendenteService.listarTudo()
    .then(list => {
      this.listaAtendentes = list.map(e => {
        return { label: e.nome, value: e };
      });
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });
  }

  carregaFormasPagamento() {
    this.formaPagamentoService.listarTudo()
    .then(list => {
      this.listaFormasPagamento = list.map(e => {
        return { label: e.descricao, value: e };
      });
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });
  }

  carregaProdutosServicos() {
    this.produtoServicoService.listarTudo()
    .then(list => {
      this.listaProdutosServicos = list.map(e => {
        return { label: e.descricao, value: e };
      });
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });
  }

  carregaClientes() {
    this.clienteService.listarTudo()
    .then(list => {
      this.listaClientes = list.map(e => {
        return { label: e.nome, value: e };
      });
      return list;

    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });
  }

  geraHoraInicio() {
    this.agendamento.atendimento.horaInicio = new Date();
  }

  geraHoraFim() {
    if (this.agendamento.atendimento) {
      this.agendamento.atendimento.horaFim = new Date();
    }
  }

  validaCamposAtendimento(status: string) {
    if (this.agendamento.status === 'C' || this.agendamento.status === 'F') {
      return true;
    }

  }

  salvarItem() {
    if (this.indexItemSelecionado < 0) {
      const atendimentoDetalhe: AtendimentoDetalhe = new AtendimentoDetalhe();
      atendimentoDetalhe.id = null;
      atendimentoDetalhe.produtoServico = this.produtoSelecionado;
      atendimentoDetalhe.tipoProdutoServico = this.produtoSelecionado.tipo;
      atendimentoDetalhe.quantidade = this.quantidadeSelecionada;
      atendimentoDetalhe.valorUnitario = this.valorUnitarioSelecionado;
      atendimentoDetalhe.valorTotal = this.valorTotalSelecionado;

      this.agendamento.atendimento.atendimentoDetalhe.push(atendimentoDetalhe);
    } else {
      const atendimentoDetalhe = this.agendamento.atendimento.atendimentoDetalhe[this.indexItemSelecionado];
      if (atendimentoDetalhe) {
        atendimentoDetalhe.produtoServico = this.produtoSelecionado;
        atendimentoDetalhe.tipoProdutoServico = this.produtoSelecionado.tipo;
        atendimentoDetalhe.quantidade = this.quantidadeSelecionada;
        atendimentoDetalhe.valorUnitario = this.valorUnitarioSelecionado;
        atendimentoDetalhe.valorTotal = this.valorTotalSelecionado;
      }
    }
    this.novoItem();
    this.calculaTotalAtendimento();
  }

  novoItem() {
    this.indexItemSelecionado = -1;
    this.produtoSelecionado = null;
    this.quantidadeSelecionada = 1;
    this.valorUnitarioSelecionado = 0;
    this.valorTotalSelecionado = 0;
  }
  onChangeProduto() {
    this.valorUnitarioSelecionado = this.produtoSelecionado.valor;
    this.calculaTotal();
  }

  calculaTotal() {
    this.valorTotalSelecionado = this.valorUnitarioSelecionado * this.quantidadeSelecionada;
  }

  calculaTotalAtendimento() {
    this.agendamento.atendimento.valorTotal = 0;
    this.agendamento.atendimento.atendimentoDetalhe.forEach(e => {
      this.agendamento.atendimento.valorTotal += Number(e.valorTotal);
    });
  }

  excluirItem(detalhe: AtendimentoDetalhe) {
    this.confirmation.confirm({
      message: 'Confirma exclusão do item?',
      accept: () => {
        const index = this.agendamento.atendimento.atendimentoDetalhe.indexOf(detalhe);
        if (index >= 0 ) {
          this.agendamento.atendimento.atendimentoDetalhe.splice(index, 1);
          this.calculaTotalAtendimento();
        } else {
          this.mensagemService.info('Item não encontrado');
        }
      }
    });
  }

  alterarItem(detalhe: AtendimentoDetalhe) {
    const index = this.agendamento.atendimento.atendimentoDetalhe.indexOf(detalhe);
    if (index >= 0) {
      this.indexItemSelecionado = index;
      this.produtoSelecionado = this.utilService.clonaObj(detalhe.produtoServico);
      this.quantidadeSelecionada = detalhe.quantidade;
      this.valorUnitarioSelecionado = detalhe.valorUnitario;
      this.valorTotalSelecionado = detalhe.valorTotal;

      this.txtQuantidade.nativeElement.focus();
      setTimeout(() => this.txtQuantidade.nativeElement.select(), 200);
    }
  }

  faturado() {
    return this.statusOriginal === 'F';
  }
}
