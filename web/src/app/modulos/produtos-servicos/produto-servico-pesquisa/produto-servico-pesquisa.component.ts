import { ProdutoServicoFiltro } from './../../../servicos/produto-servico.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { ProdutoServicoService } from 'src/app/servicos/produto-servico.service';

@Component({
  selector: 'app-produto-servico-pesquisa',
  templateUrl: './produto-servico-pesquisa.component.html',
  styleUrls: ['./produto-servico-pesquisa.component.css']
})

export class ProdutoServicoPesquisaComponent implements OnInit {
  produtosServicos = [];
  itensPorPagina = 10;
  idProdutoServicoSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: ProdutoServicoFiltro;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private produtoServicoService: ProdutoServicoService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private confirmation: ConfirmationService) {
      this.filtro = produtoServicoService.getFiltro();
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
    this.produtoServicoService.consultar(this.filtro)
      .then(resultado => {
        this.produtosServicos = resultado.produtosServicos;
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
          this.router.navigate(['/produtosServicos/', this.idProdutoServicoSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_PRODUTO_SERVICO'),
        command: () => {
            this.router.navigate(['/produtosServicos/', this.idProdutoServicoSelecionado.toString()]);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_PRODUTO_SERVICO'),
        command: () => {
            this.confirmarExclusao(this.idProdutoServicoSelecionado);
        }
      }
    ];
  }

  public acoesDropDownClick(idProdutoServicoSelecionado) {
    this.idProdutoServicoSelecionado = idProdutoServicoSelecionado;
  }

  confirmarExclusao(idProdutoServico: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idProdutoServico);
      }
    });
  }

  excluir(id: Number) {
    this.produtoServicoService.excluir(id)
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
