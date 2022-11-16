import { ContaService } from 'src/app/servicos/conta.service';
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
import { Conta, Atendente, Cliente } from 'src/app/core/model';
import { AtendenteService } from 'src/app/servicos/atendente.service';

@Component({
  selector: 'app-atendente-cadastro',
  templateUrl: './atendente-cadastro.component.html',
  styleUrls: ['./atendente-cadastro.component.css']
})
export class AtendenteCadastroComponent implements OnInit {
  atendentes = [];
  modoConsulta = false;
  atendente: Atendente;
  cliente: Cliente;
  listaContas = [];
  cfgPtBr: any;

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private atendenteService: AtendenteService,
    private utilService: UtilService,
    private configService: ConfigService,
    private contaService: ContaService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idAtendente = this.route.snapshot.params['id'];
      //const idCliente = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idAtendente) {
        this.atendente = new Atendente();
        this.carregarLancamento(idAtendente);
      } else {
        this.novo();
      }

      // if (idCliente) {
      //   this.cliente = new Cliente();
      //   this.carregarLancamento(idCliente);
      // } else {
      //   this.novo();
      // }
  }

  ngOnInit() {
    this.title.setTitle('Atendente');
    this.carregaContas();
  }

  private carregarLancamento(id: number) {
    this.atendenteService.buscarPorId(id)
      .then(atendente => {
        this.atendente = atendente;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.atendente = new Atendente();
    this.atendente.id = 0;
    this.atendente.nome = '';
    this.atendente.inativo = false;
    this.atendente.conta = new Conta();
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/atendentes']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/atendentes']);
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
    if (this.atendente.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.atendenteService.adicionar(this.atendente)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/atendentes']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.atendenteService.atualizar(this.atendente)
    .then(agendaAtualizada => {
      this.atendente = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/atendentes']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.atendente.id);
  }

  carregaContas() {
    this.contaService.listarTudo()
    .then(list => {
      this.listaContas = list.map(e => {
        return { label: e.descricao, value: e };
      });
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });
  }

}
