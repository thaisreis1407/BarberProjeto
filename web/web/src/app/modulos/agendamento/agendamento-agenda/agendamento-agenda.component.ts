import { AgendamentoCadastroDialogService } from './../../../servicos/agendamento-cadastro-dialog.service';
import { Agendamento, Atendente } from './../../../core/model';
import { ConfigService } from './../../../shared/config.service';
import { AtendenteService } from './../../../servicos/atendente.service';
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
  selector: 'app-agendamento-agenda',
  templateUrl: './agendamento-agenda.component.html',
  styleUrls: ['./agendamento-agenda.component.css']
})

export class AgendamentoAgendaComponent implements OnInit {
  agendamentos = [];
  cfgPtBr: any;
  listaAtendentes = [];
  itensPorPagina = 10;

  acaoItens: MenuItem[];
  alturaJanela = 0;
  dataSelecionada: Date;
  agendamento: Agendamento;
  agendamentoSelecionado: Agendamento;
  imagemFundoPath = 'assets/imagens/logo.png';

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private agendamentoService: AgendamentoService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private atendenteService: AtendenteService,
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private configService: ConfigService,
    private agendamentoCadastroService: AgendamentoCadastroDialogService) {
      this.agendamentoSelecionado = new Agendamento();
  }

  ngOnInit() {
    this.dataSelecionada = new Date();
    this.alturaJanela = window.innerHeight;
    this.configuraAcoes();
    this.cfgPtBr = this.configService.cfgTablePtBr;
    this.consultar();
  }

  telaMobile() {
    return this.utilService.telaMobile();
  }

  consultar(pagina = 0) {
    this.agendamentoService.consultarPorData(this.dataSelecionada)
      .then(resultado => {
        this.agendamentos = resultado.agendamentos;
      }).catch(error => this.errorHandler.handle(error));
  }

  public getTamanhoGrid() {
    return 400;
  }

  private configuraAcoes() {
    this.acaoItens =  [
      {
        label: 'Inserir',
        icon: 'pi pi-file',
        command: () => {
          if (this.agendamentoSelecionado.id) {
            this.mensagemService.info('Horário já está ocupado por outro cliente.');
            return;
          }
          this.agendamentoCadastroService.abreCadastro(
            this.agendamentoSelecionado,
            (salvou: boolean) => {
              if (salvou) {
                this.consultar();
              }
            });
        }
      },

      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_AGENDAMENTO'),
        command: () => {
          if (!this.agendamentoSelecionado.id) {
            this.mensagemService.info('Não existe agendamento para excluir.');
          } else {
            this.confirmarExclusao(this.agendamentoSelecionado.id);
          }
        }
      }
    ];
  }

  public acoesDropDownClick(idAtendimento: number, idAgenda: number, idAtendente: number, hora: string) {

    this.agendamentoSelecionado.id = idAtendimento ? idAtendimento : null;
    this.agendamentoSelecionado.idAgenda = idAgenda;
    this.agendamentoSelecionado.data = this.dataSelecionada;
    this.agendamentoSelecionado.hora = this.utilService.stringParaHora(hora);
    let atendente: Atendente = null;

    if (idAtendente) {
      atendente = new Atendente();
      atendente.id = idAtendente;
      this.agendamentoSelecionado.atendente = atendente;
    } else {
      this.agendamentoSelecionado.atendente = null;
    }
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

  // alternarInativo(agendamento: Agendamento) {
  //   const novoStatus = !agendamento.inativo;
  //   this.agendamentoService.atualizarPropriedadeInativo(agendamento.id, novoStatus)
  //   .then(() => {
  //     agendamento.inativo = novoStatus;
  //     this.msgService.sucesso('Registro atualizado com sucesso.');
  //   }).catch(error => this.errorHandler.handle(error));

  // }

  buscarCorInativo(inativo: boolean) {
    if (inativo) {
      return { 'color': 'red' };
    } else {
      return { 'color': 'blue' };
    }
  }

  public buscaCorDia(dia: number) {
    // let retorno;
    // const idx = this.diasAgenda.indexOf(dia);
    // if ( idx >= 0) {
    //   if (this.diasQtdAtendimentoPendente[idx] > 0) {
    //     retorno = { 'backgroundColor': 'inherit', 'border': '2px solid red', 'display': 'block' };
    //   } else {
    //     retorno = { 'backgroundColor': 'inherit', 'border': '2px solid #ff8800', 'display': 'block' };
    //   }
    // } else {
    //   retorno = { 'backgroundColor': 'inherit', 'display': 'block' };
    // }
    // return retorno;
    return {};
  }

  onMonthChange($event) {
    // this.anoSelecionado = $event.year;
    // this.mesSelecionado = $event.month;
    // this.carregaResumoMes();
  }


}
