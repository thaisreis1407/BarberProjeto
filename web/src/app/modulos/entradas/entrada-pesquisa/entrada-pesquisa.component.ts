import { EntradaFiltro } from './../../../servicos/entrada.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { EntradaService } from 'src/app/servicos/entrada.service';
import { Entrada } from 'src/app/core/model';

@Component({
  selector: 'app-entrada-pesquisa',
  templateUrl: './entrada-pesquisa.component.html',
  styleUrls: ['./entrada-pesquisa.component.css']
})

export class EntradaPesquisaComponent implements OnInit {
  entradas = [];
  itensPorPagina = 10;
  idEntradaSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: EntradaFiltro;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private entradaService: EntradaService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private confirmation: ConfirmationService) {

    this.filtro = this.entradaService.getFiltro();
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
    this.entradaService.consultar(this.filtro)
      .then(resultado => {
        this.entradas = resultado.entradas;
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
          this.router.navigate(['/movimentacoesContas/', this.idEntradaSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_ENTRADA'),
        command: () => {
            this.router.navigate(['/entradas/', this.idEntradaSelecionado.toString()]);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_ENTRADA'),
        command: () => {
          this.confirmarExclusao(this.idEntradaSelecionado);
        }
      }
    ];
  }

  public acoesDropDownClick(idEntradaSelecionado) {
    this.idEntradaSelecionado = idEntradaSelecionado;
  }

  confirmarExclusao(idEntrada: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idEntrada);
      }
    });
  }

  excluir(id: Number) {
    this.entradaService.excluir(id)
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

  // alternarInativo(fornecedor: Fornecedor) {
  //   const novoStatus = !fornecedor.inativo;
  //   this.fornecedorService.atualizarPropriedadeInativo(fornecedor.id, novoStatus)
  //   .then(() => {
  //     fornecedor.inativo = novoStatus;
  //     this.msgService.sucesso('Registro atualizado com sucesso.');
  //   }).catch(error => this.errorHandler.handle(error));

  // }

  buscarCorInativo(inativo: boolean) {
    if (inativo) {
      return { 'color': 'red' };
    } else {
      return { 'color': 'blue' };
    }
  }
}
