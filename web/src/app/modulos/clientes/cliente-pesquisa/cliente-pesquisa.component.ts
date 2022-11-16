import { ClienteFiltro } from './../../../servicos/cliente.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { ClienteService } from 'src/app/servicos/cliente.service';
import { Cliente } from 'src/app/core/model';

@Component({
  selector: 'app-cliente-pesquisa',
  templateUrl: './cliente-pesquisa.component.html',
  styleUrls: ['./cliente-pesquisa.component.css']
})

export class ClientePesquisaComponent implements OnInit {
  clientes = [];
  itensPorPagina = 10;
  idClienteSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: ClienteFiltro;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private clienteService: ClienteService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private confirmation: ConfirmationService) {
      this.filtro = clienteService.getFiltro();
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
    this.clienteService.consultar(this.filtro)
      .then(resultado => {
        this.clientes = resultado.clientes;
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
          this.router.navigate(['/clientes/', this.idClienteSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_CLIENTE'),
        command: () => {
            this.router.navigate(['/clientes/', this.idClienteSelecionado.toString()]);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_CLIENTE'),
        command: () => {
          if (this.idClienteSelecionado === 1) {
            this.msgService.erro('Usuário não pode ser excluído');
          } else {
            this.confirmarExclusao(this.idClienteSelecionado);
          }
        }
      }
    ];
  }

  public acoesDropDownClick(idClienteSelecionado) {
    this.idClienteSelecionado = idClienteSelecionado;
  }

  confirmarExclusao(idCliente: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idCliente);
      }
    });
  }

  excluir(id: Number) {
    this.clienteService.excluir(id)
      .then(() => {
        this.consultar();
        this.msgService.sucesso('Registro excluído.');
      }).catch(error => this.errorHandler.handle(error));
  }

  calculaLinhasGrid() {
    this.filtro.itensPorPagina = this.utilService.calculaItensPagina(this.alturaJanela, 10);

    if (this.filtro.itensPorPagina < 5 || this.telaMobile()) {
      this.filtro.itensPorPagina = 5;
    }
  }

  // alternarInativo(cliente: Cliente) {
  //   const novoStatus = !cliente.inativo;
  //   this.clienteService.atualizarPropriedadeInativo(cliente.id, novoStatus)
  //   .then(() => {
  //     cliente.inativo = novoStatus;
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
