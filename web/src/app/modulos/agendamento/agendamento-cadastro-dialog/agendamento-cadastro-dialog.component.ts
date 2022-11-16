import { ConfigService } from './../../../shared/config.service';
import { AtendenteService } from 'src/app/servicos/atendente.service';
import { ClienteService } from 'src/app/servicos/cliente.service';

import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/components/common/api';
import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from 'src/app/seguranca/auth.service';
import { MensagemService } from 'src/app/shared/mensagem.service';
import { UtilService } from 'src/app/shared/util.service';
import { Agendamento } from 'src/app/core/model';
import { AgendamentoService } from 'src/app/servicos/agendamento.service';

@Component({
  selector: 'app-agendamento-cadastro-dialog',
  templateUrl: './agendamento-cadastro-dialog.component.html',
  styleUrls: ['./agendamento-cadastro-dialog.component.css']
})
export class AgendamentoCadastroDialogComponent implements OnInit {
  agendamentos = [];
  modoConsulta = false;
  listaAtendentes = [];
  listaClientes = [];
  agendamento: Agendamento;
  cfgPtBr: any;

  agendamentoAgenda: Agendamento;

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
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

  }

  ngOnInit() {
    this.agendamentoAgenda = this.config.data ? this.config.data.agendamento : null;

    this.agendamento = new Agendamento();

    setTimeout(() => { // gambiarra para evitar problema de renderização das telas.
      this.title.setTitle('Agendamento');
      this.carregaAtendentes();
      this.carregaClientes();

      if (this.agendamentoAgenda && this.agendamentoAgenda.id) {
        this.carregarLancamento(this.agendamentoAgenda.id);
      } else {
        this.novo();
      }
    }, 300);

  }

  private carregarLancamento(id: number) {
    this.agendamentoService.buscarPorId(id)
      .then(agendamento => {
        this.agendamento = agendamento;
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

    if (this.agendamentoAgenda) {
      this.agendamento.idAgenda = this.agendamentoAgenda.idAgenda;
      this.agendamento.data = this.agendamentoAgenda.data;
      this.agendamento.hora = this.agendamentoAgenda.hora;

      this.atendenteService.buscarPorId(this.agendamentoAgenda.atendente.id).then(
        atendenteRetorno => {
          this.agendamento.atendente = atendenteRetorno;
        }
      );
    }
  }

  voltar() {
    if (this.modoConsulta) {
      this.ref.close(false);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.ref.close(false);
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

  async adicionar(form: FormControl) {
    try {
      await this.agendamentoService.adicionar(this.agendamento);
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.ref.close(true);
    } catch (erro) {
      this.errorHandler.handle(erro);
    }

    // .then(( ) => {
    //   this.mensagemService.sucesso('Registro salvo com sucesso.');
    // })
    // .catch(erro => {
    //   this.errorHandler.handle(erro);
    // });
  }

  async atualizar(form: FormControl) {
    try {
       this.agendamento = await this.agendamentoService.atualizar(this.agendamento);
       this.mensagemService.sucesso('Registro salvo com sucesso.');
       this.ref.close(true);
    } catch (erro) {
      this.errorHandler.handle(erro);
    }
    // .then(agendaAtualizada => {
    //   this.agendamento = agendaAtualizada;
    //   this.mensagemService.sucesso('Registro salvo com sucesso.');
    // })
    // .catch(erro => this.errorHandler.handle(erro));
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
        this.agendamento.hora = this.utilService.stringParaHora('09:00');
  }

  bloqueiaAgendamentoAgenda() {
    return this.agendamentoAgenda && this.agendamentoAgenda.idAgenda;
  }

}
