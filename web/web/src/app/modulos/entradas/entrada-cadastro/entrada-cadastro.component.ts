import { ProdutoServicoService } from './../../../servicos/produto-servico.service';
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
import { Entrada } from 'src/app/core/model';
import { EntradaService } from 'src/app/servicos/entrada.service';

@Component({
  selector: 'app-entrada-cadastro',
  templateUrl: './entrada-cadastro.component.html',
  styleUrls: ['./entrada-cadastro.component.css']
})
export class EntradaCadastroComponent implements OnInit {
  modoConsulta = false;
  entrada: Entrada;
  listaProdutos = [];
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
    private entradaService: EntradaService,
    private utilService: UtilService,
    private configService: ConfigService,
    private produtoServicoService: ProdutoServicoService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idEntrada = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idEntrada) {
        this.entrada = new Entrada();
        this.carregarLancamento(idEntrada);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('Entrada');
    this.carregaProdutos();
  }

  private carregarLancamento(id: number) {
    this.entradaService.buscarPorId(id)
      .then(entrada => {
        this.entrada = entrada;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.entrada = new Entrada();
    this.entrada.id = 0;
    this.entrada.dataEntrada = null;
    this.entrada.valorTotal = 0;
    this.entrada.valorUnitario = 0;
    this.entrada.quantidade = 0;
    this.entrada.produtoServico = null;
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/entradas']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/entradas']);
        }
      });
    }
  }

  calculaTotal() {
    this.entrada.valorTotal = this.entrada.valorUnitario * this.entrada.quantidade;
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
    if (this.entrada.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.entradaService.adicionar(this.entrada)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/entradas']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.entradaService.atualizar(this.entrada)
    .then(registro => {
      this.entrada = registro;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/entradas']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.entrada.id);
  }

  carregaProdutos() {
    this.produtoServicoService.listarProdutos(0)
    .then(list => {
      this.listaProdutos = list.map(e => {
        return { label: e.descricao, value: e };
      });
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });

  }

}
