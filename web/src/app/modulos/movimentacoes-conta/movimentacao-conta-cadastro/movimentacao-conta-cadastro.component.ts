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
import { Conta, MovimentacaoConta } from 'src/app/core/model';
import { MovimentacaoContaService } from 'src/app/servicos/movimentacao-conta.service';

@Component({
  selector: 'app-movimentacao-conta-cadastro',
  templateUrl: './movimentacao-conta-cadastro.component.html',
  styleUrls: ['./movimentacao-conta-cadastro.component.css']
})
export class MovimentacaoContaCadastroComponent implements OnInit {
  modoConsulta = false;
  movimentacaoConta: MovimentacaoConta;
  listaContas = [];
  inativo: boolean;
  cfgPtBr: any;

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private movimentacaoContaService: MovimentacaoContaService,
    private utilService: UtilService,
    private configService: ConfigService,
    private contaService: ContaService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idMovimentacaoConta = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idMovimentacaoConta) {
        this.movimentacaoConta = new MovimentacaoConta();
        this.carregarLancamento(idMovimentacaoConta);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('MovimentacaoConta');
    this.carregaContas();
  }

  private carregarLancamento(id: number) {
    this.movimentacaoContaService.buscarPorId(id)
      .then(movimentacaoConta => {
        this.movimentacaoConta = movimentacaoConta;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.movimentacaoConta = new MovimentacaoConta();
    this.movimentacaoConta.id = 0;
    this.movimentacaoConta.descricao = '';
    this.movimentacaoConta.tipo = '';
    this.movimentacaoConta.valor = 0;
    this.movimentacaoConta.conta = new Conta();
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/movimentacoesContas']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/movimentacoesContas']);
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
    if (this.movimentacaoConta.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.movimentacaoContaService.adicionar(this.movimentacaoConta)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/movimentacoesContas']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.movimentacaoContaService.atualizar(this.movimentacaoConta)
    .then(agendaAtualizada => {
      this.movimentacaoConta = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/movimentacoesContas']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.movimentacaoConta.id);
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
