import { DuplicataPagarFiltro } from './../../../servicos/duplicata-pagar.service';
import { ContaService } from 'src/app/servicos/conta.service';
import { FornecedorService } from 'src/app/servicos/fornecedor.service';
import { ConfigService } from './../../../shared/config.service';

import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { DuplicataPagarService } from 'src/app/servicos/duplicata-pagar.service';
import { DuplicataPagar, Conta, Fornecedor } from 'src/app/core/model';

@Component({
  selector: 'app-duplicata-pagar-pesquisa',
  templateUrl: './duplicata-pagar-pesquisa.component.html',
  styleUrls: ['./duplicata-pagar-pesquisa.component.css']
})

export class DuplicataPagarPesquisaComponent implements OnInit {
  duplicatasPagar = [];
  itensPorPagina = 10;
  idDuplicataPagarSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: DuplicataPagarFiltro;
  listaContas = [];
  listaFornecedores = [];
  dataInicioCompra: Date;
  dataFimCompra: Date;
  dataInicioVencimento: Date;
  dataFimVencimento: Date;
  dataCompraInicio: Date;
  dataCompraFim: Date;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  cfgPtBr: any;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private duplicataPagarService: DuplicataPagarService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private contaService: ContaService,
    private fornecedorService: FornecedorService,
    private mensagemService: MensagemService,
    private configService: ConfigService,
    private confirmation: ConfirmationService) {
      this.filtro = duplicataPagarService.getFiltro();
      this.cfgPtBr = this.configService.cfgTablePtBr;
  }

  ngOnInit() {
    this.alturaJanela = window.innerHeight;
    this.calculaLinhasGrid();
    this.configuraAcoes();
    this.carregaContas();
    this.carregaFornecedores();
    this.filtro.idConta = 0;
    this.filtro.idFornecedor = 0;
    this.consultar();
  }

  telaMobile() {
    return this.utilService.telaMobile();
  }

  consultar(pagina = 0) {
    if (pagina === 0) {
      // reseta a grid se for uma consulta
      this.grid.first = 0;
    }
    this.filtro.pagina = pagina;
    this.duplicataPagarService.consultar(this.filtro)
      .then(resultado => {
        this.duplicatasPagar = resultado.duplicatasPagar;
        this.totalRegistros = resultado.total;
      }).catch(error => this.errorHandler.handle(error));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.consultar(pagina);
  }

  private configuraAcoes() {
    this.acaoItens =  [
      {
        label: 'Consultar',
        icon: 'pi pi-search',
        command: () => {
          this.router.navigate(['/duplicatasPagar/', this.idDuplicataPagarSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_DUPLICATA_PAGAR'),
        command: () => {
            this.router.navigate(['/duplicatasPagar/', this.idDuplicataPagarSelecionado.toString()]);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_DUPLICATA_PAGAR'),
        command: () => {
          this.confirmarExclusao(this.idDuplicataPagarSelecionado);
        }
      }
    ];
  }

  public acoesDropDownClick(idDuplicataPagarSelecionado) {
    this.idDuplicataPagarSelecionado = idDuplicataPagarSelecionado;
  }

  confirmarExclusao(idDuplicataPagar: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idDuplicataPagar);
      }
    });
  }

  excluir(id: Number) {
    this.duplicataPagarService.excluir(id)
      .then(() => {
        this.consultar();
        this.msgService.sucesso('Registro excluído.');
      }).catch(error => this.errorHandler.handle(error));
  }

  calculaLinhasGrid() {
    this.filtro.itensPorPagina = this.utilService.calculaItensPagina(this.alturaJanela, 12);

    if (this.filtro.itensPorPagina < 5 || this.telaMobile()) {
      this.filtro.itensPorPagina = 5;
    }
  }

  buscarCorInativo(inativo: boolean) {
    if (inativo) {
      return { 'color': 'red' };
    } else {
      return { 'color': 'blue' };
    }
  }

  carregaContas() {
    this.contaService.listarTudo()
    .then(list => {
      this.listaContas = list.map((e: any) => {
        return { label: e.descricao, value: e };
      });
      this.listaContas.splice(0, 0, {label: 'Todas', value: 0});
      return list;
    })
    .catch(error => {
      this.errorHandler.handle(error);
    });
  }

  carregaFornecedores() {
    this.fornecedorService.listarTudo()
    .then(list => {
      this.listaFornecedores = list.map(e => {
        return { label: e.nome, value: e };
      });
      this.listaFornecedores.splice(0, 0, {label: 'Todos', value: 0});
      return list;
    })
    .catch(() => {
      this.mensagemService.erro('Erro ao buscar dados do servidor. Tente novamente');
    });
  }

  carregaDataAtual() {
    // this.dataFimCompra = new Date() - 30;
    // this.dataFim = new Date();
    // this.filtro.dataInicio = this.dataInicio;
    // this.filtro.dataFim = this.dataFim;
  }
}
