import { FormaPagamentoFiltro } from './../../../servicos/forma-pagamento.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { FormaPagamentoService } from 'src/app/servicos/forma-pagamento.service';
import { FormaPagamento } from 'src/app/core/model';

@Component({
  selector: 'app-forma-pagamento-pesquisa',
  templateUrl: './forma-pagamento-pesquisa.component.html',
  styleUrls: ['./forma-pagamento-pesquisa.component.css']
})

export class FormaPagamentoPesquisaComponent implements OnInit {
  formasPagamento = [];
  itensPorPagina = 10;
  idFormaPagamentoSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: FormaPagamentoFiltro;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private formaPagamentoService: FormaPagamentoService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private confirmation: ConfirmationService) {
      this.filtro = formaPagamentoService.getFiltro();
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
    this.formaPagamentoService.consultar(this.filtro)
      .then(resultado => {
        this.formasPagamento = resultado.formasPagamento;
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
          this.router.navigate(['/formasPagamento/', this.idFormaPagamentoSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_FORMAPAGAMENTO'),
        command: () => {
            this.router.navigate(['/formasPagamento/', this.idFormaPagamentoSelecionado.toString()]);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_FORMAPAGAMENTO'),
        command: () => {
          if (this.idFormaPagamentoSelecionado === 1) {
            this.msgService.erro('Forma de Pagamento não pode ser excluído');
          } else {
            this.confirmarExclusao(this.idFormaPagamentoSelecionado);
          }
        }
      }
    ];
  }

  public acoesDropDownClick(idFormaPagamentoSelecionado) {
    this.idFormaPagamentoSelecionado = idFormaPagamentoSelecionado;
  }

  confirmarExclusao(idFormaPagamento: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idFormaPagamento);
      }
    });
  }

  excluir(id: Number) {
    this.formaPagamentoService.excluir(id)
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
