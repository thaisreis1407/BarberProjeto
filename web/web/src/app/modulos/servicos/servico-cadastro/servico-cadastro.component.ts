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
import { Servico } from 'src/app/core/model';
import { ServicoService } from 'src/app/servicos/servico.service';

@Component({
  selector: 'app-servico-cadastro',
  templateUrl: './servico-cadastro.component.html',
  styleUrls: ['./servico-cadastro.component.css']
})
export class ServicoCadastroComponent implements OnInit {
  servicos = [];
  modoConsulta = false;
  servico: Servico;
  cfgPtBr: any;

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private servicoService: ServicoService,
    private utilService: UtilService,
    private configService: ConfigService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idServico = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idServico) {
        this.servico = new Servico();
        this.carregarLancamento(idServico);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('Servico');
  }

  private carregarLancamento(id: number) {
    this.servicoService.buscarPorId(id)
      .then(servico => {
        this.servico = servico;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.servico = new Servico();
    this.servico.id = 0;
    this.servico.descricao = '';
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/servicos']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/servicos']);
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
    if (this.servico.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.servicoService.adicionar(this.servico)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/servicos']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.servicoService.atualizar(this.servico)
    .then(agendaAtualizada => {
      this.servico = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/servicos']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.servico.id);
  }

}
