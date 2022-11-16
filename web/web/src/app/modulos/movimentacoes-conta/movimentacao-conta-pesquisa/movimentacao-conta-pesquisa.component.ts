import { MovimentacaoContaFiltro } from './../../../servicos/movimentacao-conta.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { MovimentacaoContaService } from 'src/app/servicos/movimentacao-conta.service';
import { MovimentacaoConta } from 'src/app/core/model';

@Component({
  selector: 'app-movimentacao-conta-pesquisa',
  templateUrl: './movimentacao-conta-pesquisa.component.html',
  styleUrls: ['./movimentacao-conta-pesquisa.component.css']
})

export class MovimentacaoContaPesquisaComponent implements OnInit {
  movimentacoesContas = [];
  itensPorPagina = 10;
  idMovimentacaoContaSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: MovimentacaoContaFiltro;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private movimentacaoContaService: MovimentacaoContaService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private confirmation: ConfirmationService) {
      this.filtro = movimentacaoContaService.getFiltro();
  }

  ngOnInit() {
    this.alturaJanela = window.innerHeight;
    this.calculaLinhasGrid();
    this.configuraAcoes();
    this.filtro.descricao = '';
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
    this.movimentacaoContaService.consultar(this.filtro)
      .then(resultado => {
        this.movimentacoesContas = resultado.movimentacoesContas;
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
          this.router.navigate(['/movimentacoesContas/', this.idMovimentacaoContaSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_MOVIMENTACAO_CONTA'),
        command: () => {
            this.router.navigate(['/movimentacoesContas/', this.idMovimentacaoContaSelecionado.toString()]);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_MOVIMENTACAO_CONTA'),
        command: () => {
            this.confirmarExclusao(this.idMovimentacaoContaSelecionado);
        }
      }
    ];
  }

  public acoesDropDownClick(idMovimentacaoContaSelecionado) {
    this.idMovimentacaoContaSelecionado = idMovimentacaoContaSelecionado;
  }

  confirmarExclusao(idMovimentacaoConta: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idMovimentacaoConta);
      }
    });
  }

  excluir(id: Number) {
    this.movimentacaoContaService.excluir(id)
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
}
