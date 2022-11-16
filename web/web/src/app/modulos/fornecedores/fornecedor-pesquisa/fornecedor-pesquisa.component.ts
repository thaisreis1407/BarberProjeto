import { FornecedorFiltro } from './../../../servicos/fornecedor.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { FornecedorService } from 'src/app/servicos/fornecedor.service';
import { Fornecedor } from 'src/app/core/model';

@Component({
  selector: 'app-fornecedor-pesquisa',
  templateUrl: './fornecedor-pesquisa.component.html',
  styleUrls: ['./fornecedor-pesquisa.component.css']
})

export class FornecedorPesquisaComponent implements OnInit {
  fornecedores = [];
  listaDias = [
    {label: 'Sem dia Definido', value: 100},
    {label: 'Toda Segunda', value: 101},
    {label: 'Toda Terça', value: 102},
    {label: 'Toda Quarta', value: 103},
    {label: 'Toda Quinta', value: 104},
    {label: 'Toda Sexta', value: 105},
    {label: 'Todo Sábado', value: 106},
    {label: 'Dia 01', value: 1},
    {label: 'Dia 05', value: 5},
    {label: 'Dia 10', value: 10},
    {label: 'Dia 15', value: 15},
    {label: 'Dia 20', value: 20},
    {label: 'Dia 25', value: 25},
    {label: 'Dia 30', value: 30}
  ];

  itensPorPagina = 10;
  idFornecedorSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: FornecedorFiltro;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private fornecedorService: FornecedorService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private confirmation: ConfirmationService) {
      this.filtro = fornecedorService.getFiltro();
  }

  ngOnInit() {
    this.alturaJanela = window.innerHeight;
    this.calculaLinhasGrid();
    this.configuraAcoes();
    this.filtro.nome = '';
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
    this.fornecedorService.consultar(this.filtro)
      .then(resultado => {
        this.fornecedores = resultado.fornecedores;
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
          this.router.navigate(['/fornecedores/', this.idFornecedorSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_FORNECEDOR'),
        command: () => {
            this.router.navigate(['/fornecedores/', this.idFornecedorSelecionado.toString()]);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_FORNECEDOR'),
        command: () => {
          if (this.idFornecedorSelecionado === 1) {
            this.msgService.erro('Usuário não pode ser excluído');
          } else {
            this.confirmarExclusao(this.idFornecedorSelecionado);
          }
        }
      }
    ];
  }

  public acoesDropDownClick(idFornecedorSelecionado) {
    this.idFornecedorSelecionado = idFornecedorSelecionado;
  }

  confirmarExclusao(idFornecedor: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idFornecedor);
      }
    });
  }

  excluir(id: Number) {
    this.fornecedorService.excluir(id)
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

  buscaTextoDia(codDia: number) {
    const objDia = this.listaDias.find(obj => obj.value === codDia);
    if (objDia) {
      return objDia.label;
    } else {
        return '';
      }

  }
}
