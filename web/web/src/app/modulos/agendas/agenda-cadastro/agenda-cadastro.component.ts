import { AgendaDetalhe } from './../../../core/model';
import { AtendenteService } from 'src/app/servicos/atendente.service';
import { ConfigService } from './../../../shared/config.service';

import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/components/common/api';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/seguranca/auth.service';
import { MensagemService } from 'src/app/shared/mensagem.service';
import { UtilService } from 'src/app/shared/util.service';
import { Atendente, Agenda } from 'src/app/core/model';
import { AgendaService } from 'src/app/servicos/agenda.service';

@Component({
  selector: 'app-agenda-cadastro',
  templateUrl: './agenda-cadastro.component.html',
  styleUrls: ['./agenda-cadastro.component.css']
})
export class AgendaCadastroComponent implements OnInit {
  modoConsulta = false;
  agenda: Agenda;
  listaAtendentes = [];
  inativo: boolean;
  cfgPtBr: any;
  diasSemana = [];
  agendaDetalhe: AgendaDetalhe;
  itensPorPagina = 5;
  alturaJanela = 0;
  idxDetalheList = undefined;
  totalRegistros = 0;

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private agendaService: AgendaService,
    private utilService: UtilService,
    private configService: ConfigService,
    private atendenteService: AtendenteService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idAgenda = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';
      if (idAgenda) {
        this.agenda = new Agenda();
        this.novoDetalhe();
        this.carregarLancamento(idAgenda);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('Agenda');
    this.carregaAtendentes();
    this.carregaDiasSemana();
    this.alturaJanela = window.innerHeight;
    this.calculaLinhasGrid();
  }

  getTotalRegistros() {
    if (!this.agenda || !this.agenda.agendaDetalhe) {
      return 0;
    }
    return this.agenda.agendaDetalhe.length;
  }

  private carregarLancamento(id: number) {
    this.agendaService.buscarPorId(id)
      .then(agenda => {
        this.agenda = agenda;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  telaMobile() {
    return this.utilService.telaMobile();
  }

  alterarDetalhe(detalhe: AgendaDetalhe) {
    this.idxDetalheList = undefined;
    const idx = this.agenda.agendaDetalhe.findIndex(e => e === detalhe);
    const retorno = this.utilService.clonaObj(detalhe);
    if (retorno) {
      this.idxDetalheList = idx;
      retorno.horarioInicio = new Date(retorno.horarioInicio);
      retorno.horarioFim = new Date(retorno.horarioFim);
      this.agendaDetalhe = retorno;
    }
  }

  excluirDetalhe(detalhe: AgendaDetalhe) {
    const idx = this.agenda.agendaDetalhe.findIndex(e => e === detalhe);
    this.agenda.agendaDetalhe.splice(idx, 1);
    this.novoDetalhe();
  }

  confirmarExclusaoDetalhe(detalhe: AgendaDetalhe) {
    this.confirmation.confirm({
      message: 'Confirma exclusão do horário?',
      accept: () => {
        this.excluirDetalhe(detalhe);
      }
    });
  }

  carregaDiasSemana() {
    this.diasSemana = [
      {label: 'Domingo', value: 0},
      {label: 'Segunda', value: 1},
      {label: 'Terça', value: 2},
      {label: 'Quarta', value: 3},
      {label: 'Quinta', value: 4},
      {label: 'Sexta', value: 5},
      {label: 'Sábado', value: 6},
    ];
  }

  novo() {
    this.agenda = new Agenda();
    this.agenda.id = 0;
    this.agenda.nome = '';
    this.agenda.intervaloMinutos = 0;
    this.agenda.atendente = null;

    this.novoDetalhe();
  }

  buscaNomeDiaSemana(nDia: Number) {
    switch (nDia) {
      case 0:
        return 'Domingo';
      case 1:
        return 'Segunda';
      case 2:
        return 'Terça';
      case 3:
        return 'Quarta';
      case 4:
        return 'Quinta';
      case 5:
         return 'Sexta';
      case 6:
        return 'Sabado';
      default:
        return '';
    }
    return '123';
  }

  calculaLinhasGrid() {
    this.itensPorPagina = this.utilService.calculaItensPagina(this.alturaJanela, 8);

    if (this.itensPorPagina < 5 || this.telaMobile()) {
      this.itensPorPagina = 5;
    }
  }

  novoDetalhe() {
    this.agendaDetalhe = new AgendaDetalhe();
    this.idxDetalheList = undefined;
  }

  validaForm() {
    if (!this.agenda.agendaDetalhe || this.agenda.agendaDetalhe.length === 0 ||
      !this.agenda.intervaloMinutos || !this.agenda.nome) {
        return false;
      }
    return true;
  }
  geraHoraInicioFim(tipo: string) {
    if (tipo === 'inicio') {
      if (!this.agendaDetalhe.horarioInicio) {
        this.agendaDetalhe.horarioInicio = this.utilService.stringParaHora('09:00');
      }
    } else {
      if (!this.agendaDetalhe.horarioFim) {
        this.agendaDetalhe.horarioFim = this.utilService.stringParaHora('19:00');
      }
    }
  }

  validaDetalhe() {
    return this.agendaDetalhe.diaSemana >= 0 && this.agendaDetalhe.horarioInicio
      && this.agendaDetalhe.horarioFim;
  }

  salvarDetalhe(detalhe: AgendaDetalhe) {
    // validações

    if (!detalhe) {
      this.mensagemService.erro('Detalhe não encontrado.');
      return;
    }

    if (! (detalhe.diaSemana >= 0)) {
      this.mensagemService.erro('Informe o dia da semana.');
      return;
    }

    if (!detalhe.horarioInicio) {
      this.mensagemService.erro('Informe o horário de inicio.');
      return;
    }

    if (!detalhe.horarioFim) {
      this.mensagemService.erro('Informe o horário fim.');
      return;
    }

    if (!this.validaHorarioDetalhe(detalhe)) {
      return;
    }

    if (this.idxDetalheList >= 0 ) {
      this.agenda.agendaDetalhe[this.idxDetalheList] = detalhe;
    } else {
      this.agenda.agendaDetalhe.push(detalhe);
    }

    this.agenda.agendaDetalhe.sort((a, b) => {
      if (a.diaSemana < b.diaSemana) {
        return -1;
      }

      if (a.diaSemana === b.diaSemana) {
        if (a.horarioInicio < b.horarioInicio) {
          return -1;
        } else if (a.horarioInicio > b.horarioInicio) {
          return 1;
        } else {
          return 0;
        }
      }

      if (a.diaSemana > b.diaSemana) {
        return 1;
      }
    });


    this.novoDetalhe();
  }

  validaHorarioDetalhe(agendaDetalheVerificar: AgendaDetalhe) {
    let validou = true;
    this.agenda.agendaDetalhe.forEach((ag, index) => {
      if (index !== this.idxDetalheList) {
        if (agendaDetalheVerificar.diaSemana === ag.diaSemana) {
          if ((ag.horarioInicio.getTime() >= agendaDetalheVerificar.horarioInicio.getTime())
          && (ag.horarioInicio.getTime() <= agendaDetalheVerificar.horarioFim
              .getTime())) {
            validou = false;
          }
          if ((ag.horarioFim.getTime() <= agendaDetalheVerificar.horarioFim.getTime())
              && (ag.horarioFim.getTime() >= agendaDetalheVerificar.horarioInicio
                  .getTime())) {
            validou = false;
          }

          if ((agendaDetalheVerificar.horarioInicio.getTime() >= ag.horarioInicio
              .getTime())
              && (agendaDetalheVerificar.horarioInicio.getTime() <= ag.horarioFim
                  .getTime())) {
            validou = false;
          }

          if ((agendaDetalheVerificar.horarioFim.getTime() <= ag.horarioFim.getTime())
              && (agendaDetalheVerificar.horarioFim.getTime() >= ag.horarioInicio
                  .getTime())) {
            validou = false;
          }
        }
      }
    });

    if (!validou) {
      this.mensagemService.erro('Existe outro horário no mesmo intervalo.');
      return validou;
    }
    return validou;
  }
  /*
  for (int i = 0; i < lista.size(); i++) {
    AgendaDetalhe agendaDetalhe = lista.get(i);
    if (i != index) {
      if (agendaDetalhe.getDiaSemana() == agendaDetalheVerificar.getDiaSemana()) {

        if (agendaDetalhe.getHorarioInicio().getTime() == agendaDetalheVerificar.getHorarioInicio()
            .getTime()) {
          return false;
        }

        if ((agendaDetalhe.getHorarioInicio().getTime() >= agendaDetalheVerificar.getHorarioInicio()
            .getTime())
            && (agendaDetalhe.getHorarioInicio().getTime() <= agendaDetalheVerificar.getHorarioFim()
                .getTime())) {
          return false;
        }

        if ((agendaDetalhe.getHorarioFim().getTime() <= agendaDetalheVerificar.getHorarioFim().getTime())
            && (agendaDetalhe.getHorarioFim().getTime() >= agendaDetalheVerificar.getHorarioInicio()
                .getTime())) {
          return false;
        }

        if ((agendaDetalheVerificar.getHorarioInicio().getTime() >= agendaDetalhe.getHorarioInicio()
            .getTime())
            && (agendaDetalheVerificar.getHorarioInicio().getTime() <= agendaDetalhe.getHorarioFim()
                .getTime())) {
          return false;
        }

        if ((agendaDetalheVerificar.getHorarioFim().getTime() <= agendaDetalhe.getHorarioFim().getTime())
            && (agendaDetalheVerificar.getHorarioFim().getTime() >= agendaDetalhe.getHorarioInicio()
                .getTime())) {
          return false;
        }

      }
    }
  }*/

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/agendas']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/agendas']);
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
    if (this.agenda.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.agendaService.adicionar(this.agenda)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/agendas']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.agendaService.atualizar(this.agenda)
    .then(agendaAtualizada => {
      this.agenda = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/agendas']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.agenda.id);
  }

  carregaAtendentes() {
    this.atendenteService.listarTudo().then(list => {
      this.listaAtendentes = list.map(e => {
        return { label: e.nome, value: e };
      });
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });

  }

}
