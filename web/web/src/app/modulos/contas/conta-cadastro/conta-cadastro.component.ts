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
import { Conta } from 'src/app/core/model';
import { ContaService } from 'src/app/servicos/conta.service';

@Component({
  selector: 'app-conta-cadastro',
  templateUrl: './conta-cadastro.component.html',
  styleUrls: ['./conta-cadastro.component.css']
})
export class ContaCadastroComponent implements OnInit {
  contas = [];
  modoConsulta = false;
  conta: Conta;
  cfgPtBr: any;

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private contaService: ContaService,
    private utilService: UtilService,
    private configService: ConfigService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idConta = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idConta) {
        this.conta = new Conta();
        this.carregarLancamento(idConta);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('Conta');
  }

  private carregarLancamento(id: number) {
    this.contaService.buscarPorId(id)
      .then(conta => {
        this.conta = conta;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.conta = new Conta();
    this.conta.id = 0;
    this.conta.descricao = '';
    this.conta.saldo = 0;
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/contas']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/contas']);
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
    if (this.conta.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.contaService.adicionar(this.conta)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/contas']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.contaService.atualizar(this.conta)
    .then(agendaAtualizada => {
      this.conta = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/contas']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.conta.id);
  }

}
