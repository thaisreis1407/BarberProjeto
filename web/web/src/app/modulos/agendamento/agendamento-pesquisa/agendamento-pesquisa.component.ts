import { ConfigService } from './../../../shared/config.service';
import { AtendenteService } from './../../../servicos/atendente.service';
import { ClienteService } from './../../../servicos/cliente.service';
import { AgendamentoFiltro } from './../../../servicos/agendamento.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { AgendamentoService } from 'src/app/servicos/agendamento.service';


@Component({
  selector: 'app-agendamento-pesquisa',
  templateUrl: './agendamento-pesquisa.component.html',
  styleUrls: ['./agendamento-pesquisa.component.css']
})

export class AgendamentoPesquisaComponent implements OnInit {
  agendamentos = [];
  listaAtendentes = [];
  listaClientes = [];
  itensPorPagina = 10;
  idAgendamentoSelecionado = 0;
  statusSelecionado = '';
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: AgendamentoFiltro;
  dataInicio: Date;
  dataFim: Date;
  cfgPtBr: any;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private agendamentoService: AgendamentoService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private atendenteService: AtendenteService,
    private clienteService: ClienteService,
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private configService: ConfigService) {
      this.filtro = agendamentoService.getFiltro();
      this.cfgPtBr = this.configService.cfgTablePtBr;
  }

  ngOnInit() {
    this.alturaJanela = window.innerHeight;
    this.calculaLinhasGrid();
    this.configuraAcoes();
    this.carregaAtendentes();
    this.carregaClientes();

    this.consultar();
  }

  telaMobile() {
    return this.utilService.telaMobile();
  }

  carregaAtendentes() {
    this.atendenteService.listarTudo()
    .then(list => {
      this.listaAtendentes = list.map(e => {
        return { label: e.nome, value: e.id };
      });
      this.listaAtendentes.splice(0, 0, {label: 'Todos', value: 0});
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
        return { label: e.nome, value: e.id };
      });
      this.listaClientes.splice(0, 0, {label: 'Todos', value: 0});
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });
  }

  consultar(pagina = 0) {
    if (pagina === 0) {
      // reseta a grid se for uma consulta
      this.grid.first = 0;
    }

    this.filtro.pagina = pagina;
    this.agendamentoService.consultar(this.filtro)
      .then(resultado => {
        this.agendamentos = resultado.agendamentos;
        this.totalRegistros = resultado.total;
      }).catch(error => this.errorHandler.handle(error));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.consultar(pagina);
  }

  private configuraAcoes() {
    this.acaoItens =  [
      {
        label: 'Consultar',
        icon: 'pi pi-search',
        command: () => {
          this.router.navigate(['/agendamentos/', this.idAgendamentoSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_AGENDAMENTO'),
        command: () => {
            this.router.navigate(['/agendamentos/', this.idAgendamentoSelecionado.toString()]);
        }
      },
      {
        label: 'Iniciar Atendimento',
        icon: 'pi pi-plus-circle',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_AGENDAMENTO'),
        command: () => {
            this.abrirAtendimento(this.idAgendamentoSelecionado);
        }
      },
      {
        label: 'Excluir Atendimento',
        icon: 'pi pi-minus-circle',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_AGENDAMENTO'),
        command: () => {
            this.excluirAtendimento(this.idAgendamentoSelecionado);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_AGENDAMENTO'),
        command: () => {
            this.confirmarExclusao(this.idAgendamentoSelecionado);
        }
      }
    ];
  }

  public acoesDropDownClick(idAgendamentoSelecionado, statusSelecionado) {
    this.idAgendamentoSelecionado = idAgendamentoSelecionado;
    this.statusSelecionado = statusSelecionado;
  }

  confirmarExclusao(idAgendamento: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idAgendamento);
      }
    });
  }

  excluir(id: Number) {
    this.agendamentoService.excluir(id)
      .then(() => {
        this.consultar();
        this.msgService.sucesso('Registro excluído.');
      }).catch(error => this.errorHandler.handle(error));
  }

  calculaLinhasGrid() {
    this.filtro.itensPorPagina = this.utilService.calculaItensPagina(this.alturaJanela, 10);

    if (this.filtro.itensPorPagina < 5 || this.telaMobile()) {
      this.filtro.itensPorPagina = 5;
    }
  }

  buscarCorInativo(inativo: boolean) {
    if (inativo) {
      return { 'color': 'red' };
    } else {
      return { 'color': 'blue' };
    }
  }

  buscaNomeStatus(status: string) {
    if (status === 'C') {
      return 'Concluído';
    } else if (status === 'A') {
      return 'Agendado';
    } else if (status === 'E') {
      return 'Em Atendimento';
    } else if (status === 'F') {
      return 'Faturado';
    }
  }

  abrirAtendimento(id: number) {
    this.agendamentoService.abrirAtendimento(id).then(() => {
      this.confirmation.confirm({
        message: 'Atendimento foi aberto. Deseja lançar detalhes agora?',
        accept: () => {
          this.router.navigate(['/agendamentos/', this.idAgendamentoSelecionado.toString()]);
        },
        reject: () => {
          this.consultar();
        }
      });

    }).catch(error => this.errorHandler.handle(error));

  }

  excluirAtendimento(id: number) {
    this.confirmation.confirm({
      message: 'Confirma a exclusão do atendimento vinculado ao agendamento?',
      accept: () => {
        this.agendamentoService.excluirAtendimento(id).then(() => {
          this.consultar();
        }).catch(error => this.errorHandler.handle(error));
      }
    });

  }
}
