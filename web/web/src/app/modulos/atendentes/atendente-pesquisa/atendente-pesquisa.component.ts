import { AtendenteFiltro } from './../../../servicos/atendente.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { AtendenteService } from 'src/app/servicos/atendente.service';
import { Atendente } from 'src/app/core/model';

@Component({
  selector: 'app-atendente-pesquisa',
  templateUrl: './atendente-pesquisa.component.html',
  styleUrls: ['./atendente-pesquisa.component.css']
})

export class AtendentePesquisaComponent implements OnInit {
  atendentes = [];
  itensPorPagina = 10;
  idAtendenteSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: AtendenteFiltro;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private atendenteService: AtendenteService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private confirmation: ConfirmationService) {
      this.filtro = atendenteService.getFiltro();
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
    this.atendenteService.consultar(this.filtro)
      .then(resultado => {
        this.atendentes = resultado.atendentes;
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
          this.router.navigate(['/atendentes/', this.idAtendenteSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_CONTA'),
        command: () => {
            this.router.navigate(['/atendentes/', this.idAtendenteSelecionado.toString()]);
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_CONTA'),
        command: () => {
          if (this.idAtendenteSelecionado === 1) {
            this.msgService.erro('Atendente não pode ser excluído');
          } else {
            this.confirmarExclusao(this.idAtendenteSelecionado);
          }
        }
      }
    ];
  }

  public acoesDropDownClick(idAtendenteSelecionado) {
    this.idAtendenteSelecionado = idAtendenteSelecionado;
  }

  confirmarExclusao(idAtendente: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idAtendente);
      }
    });
  }

  excluir(id: Number) {
    this.atendenteService.excluir(id)
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

  buscarCorInativo(bloqueado: boolean) {
    if (bloqueado) {
      return { 'color': 'red' };
    } else {
      return { 'color': 'blue' };
    }
  }

}
