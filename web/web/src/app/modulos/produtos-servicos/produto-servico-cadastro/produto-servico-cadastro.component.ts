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
import { ProdutoServico } from 'src/app/core/model';
import { ProdutoServicoService } from 'src/app/servicos/produto-servico.service';

@Component({
  selector: 'app-produto-servico-cadastro',
  templateUrl: './produto-servico-cadastro.component.html',
  styleUrls: ['./produto-servico-cadastro.component.css']
})
export class ProdutoServicoCadastroComponent implements OnInit {
  produtos = [];
  modoConsulta = false;
  produtoServico: ProdutoServico;
  idProdutoServico: number;
  cfgPtBr: any;

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private produtoServicoService: ProdutoServicoService,
    private utilService: UtilService,
    private configService: ConfigService

    ) {

      this.cfgPtBr = this.configService.cfgTablePtBr;
      this.idProdutoServico = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (this.idProdutoServico) {
        this.produtoServico = new ProdutoServico();
        this.carregarLancamento(this.idProdutoServico);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('Produto/Serviço');
  }

  private carregarLancamento(id: number) {
    this.produtoServicoService.buscarPorId(id)
      .then(produtoServico => {
        this.produtoServico = produtoServico;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.produtoServico = new ProdutoServico();
    this.produtoServico.id = 0;
    this.produtoServico.bloqueado = false;
    this.produtoServico.tipo = 1;
    this.produtoServico.saldo = 0;
    this.produtoServico.custo = 0;
    this.produtoServico.descricao = '';
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/produtosServicos']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/produtosServicos']);
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
    if (this.produtoServico.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.produtoServicoService.adicionar(this.produtoServico)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/produtosServicos']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.produtoServicoService.atualizar(this.produtoServico)
    .then(agendaAtualizada => {
      this.produtoServico = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/produtosServicos']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.produtoServico.id);
  }

}
