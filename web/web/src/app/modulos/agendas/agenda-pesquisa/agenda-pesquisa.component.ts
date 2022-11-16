import { AgendaFiltro } from './../../../servicos/agenda.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { AgendaService } from 'src/app/servicos/agenda.service';
import { Agenda } from 'src/app/core/model';

@Component({
  selector: 'app-agenda-pesquisa',
  templateUrl: './agenda-pesquisa.component.html',
  styleUrls: ['./agenda-pesquisa.component.css']
})

export class AgendaPesquisaComponent implements OnInit {
  agendas = [];
  itensPorPagina = 10;
  idAgendaSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: AgendaFiltro;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private agendaService: AgendaService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private confirmation: ConfirmationService) {
      this.filtro = agendaService.getFiltro();
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
    this.agendaService.consultar(this.filtro)
      .then(resultado => {
        this.agendas = resultado.agenda;
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
          this.router.navigate(['/agendas/', this.idAgendaSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_AGENDA'),
        command: () => {
            this.router.navigate(['/agendas/', this.idAgendaSelecionado.toString()]);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_AGENDA'),
        command: () => {
          this.confirmarExclusao(this.idAgendaSelecionado);
        }
      }
    ];
  }

  public acoesDropDownClick(idAgendaSelecionado) {
    this.idAgendaSelecionado = idAgendaSelecionado;
  }

  confirmarExclusao(idAgenda: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idAgenda);
      }
    });
  }

  excluir(id: Number) {
    this.agendaService.excluir(id)
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
