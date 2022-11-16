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
import { Conta, FormaPagamento } from 'src/app/core/model';
import { FormaPagamentoService } from 'src/app/servicos/forma-pagamento.service';

@Component({
  selector: 'app-forma-pagamento-cadastro',
  templateUrl: './forma-pagamento-cadastro.component.html',
  styleUrls: ['./forma-pagamento-cadastro.component.css']
})
export class FormaPagamentoCadastroComponent implements OnInit {
  modoConsulta = false;
  formaPagamento: FormaPagamento;
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
    private formaPagamentoService: FormaPagamentoService,
    private utilService: UtilService,
    private configService: ConfigService,
    private contaService: ContaService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idFormaPagamento = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idFormaPagamento) {
        this.formaPagamento = new FormaPagamento();
        this.carregarLancamento(idFormaPagamento);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('FormaPagamento');
    this.carregaContas();
  }

  private carregarLancamento(id: number) {
    this.formaPagamentoService.buscarPorId(id)
      .then(formaPagamento => {
        this.formaPagamento = formaPagamento;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.formaPagamento = new FormaPagamento();
    this.formaPagamento.id = 0;
    this.formaPagamento.descricao = '';
    this.formaPagamento.conta = new Conta();
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/formasPagamento']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/formasPagamento']);
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
    if (this.formaPagamento.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.formaPagamentoService.adicionar(this.formaPagamento)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/formasPagamento']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.formaPagamentoService.atualizar(this.formaPagamento)
    .then(agendaAtualizada => {
      this.formaPagamento = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/formasPagamento']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.formaPagamento.id);
  }


  carregaContas() {
    this.contaService.listarTudo()
    .then(list => {
      this.listaContas = list.map(e => {
        return { label: e.descricao, value: e };
      })
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });
  }

}
