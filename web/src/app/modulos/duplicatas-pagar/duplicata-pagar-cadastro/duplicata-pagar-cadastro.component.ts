import { ConfigService } from './../../../shared/config.service';
import { ContaService } from 'src/app/servicos/conta.service';
import { FornecedorService } from 'src/app/servicos/fornecedor.service';

import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/components/common/api';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/seguranca/auth.service';
import { MensagemService } from 'src/app/shared/mensagem.service';
import { UtilService } from 'src/app/shared/util.service';
import { Conta, Fornecedor, DuplicataPagar } from 'src/app/core/model';
import { DuplicataPagarService } from 'src/app/servicos/duplicata-pagar.service';

@Component({
  selector: 'app-duplicata-pagar-cadastro',
  templateUrl: './duplicata-pagar-cadastro.component.html',
  styleUrls: ['./duplicata-pagar-cadastro.component.css']
})
export class DuplicataPagarCadastroComponent implements OnInit {
  modoConsulta = false;
  duplicataPagar: DuplicataPagar;
  cfgPtBr: any;
  listaContas = [];
  listaFornecedor = [];

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private duplicataPagarService: DuplicataPagarService,
    private utilService: UtilService,
    private configService: ConfigService,
    private contaService: ContaService,
    private fornecedorService: FornecedorService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idDuplicataPagar = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idDuplicataPagar) {
        this.duplicataPagar = new DuplicataPagar();
        this.carregarLancamento(idDuplicataPagar);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('DuplicataPagar');
    this.carregaContas();
    this.carregaFornecedor();
  }

  private carregarLancamento(id: number) {
    this.duplicataPagarService.buscarPorId(id)
      .then(duplicataPagar => {
        this.duplicataPagar = duplicataPagar;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.duplicataPagar = new DuplicataPagar();
    this.duplicataPagar.id = 0;
    //this.duplicataPagar.dataCompra = 0;
    //this.duplicataPagar.dataVencimento = 0;
    this.duplicataPagar.valor = 0;
    //this.duplicataPagar.conta = null;
    //this.duplicataPagar.fornecedor = null;
    this.duplicataPagar.conta = new Conta();
    this.duplicataPagar.fornecedor = new Fornecedor();
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/duplicatasPagar']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/duplicatasPagar']);
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
    if (this.duplicataPagar.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.duplicataPagarService.adicionar(this.duplicataPagar)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/duplicatasPagar']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.duplicataPagarService.atualizar(this.duplicataPagar)
    .then(agendaAtualizada => {
      this.duplicataPagar = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/duplicatasPagar']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.duplicataPagar.id);
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

  carregaFornecedor() {
    this.fornecedorService.listarTudo()
    .then(list => {
      this.listaFornecedor = list.map(e => {
        return { label: e.nome, value: e };
      });
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });
  }

}
