import { UsuarioFiltro } from './../../../servicos/usuario.service';
import { Table } from 'primeng/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, MenuItem, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';

import { MensagemService } from 'src/app/shared/mensagem.service';
import { AuthService } from '../../../seguranca/auth.service';
import { UtilService } from '../../../shared/util.service';
import { UsuarioService } from 'src/app/servicos/usuario.service';
import { Usuario } from 'src/app/core/model';

@Component({
  selector: 'app-usuario-pesquisa',
  templateUrl: './usuario-pesquisa.component.html',
  styleUrls: ['./usuario-pesquisa.component.css']
})

export class UsuarioPesquisaComponent implements OnInit {
  usuarios = [];
  itensPorPagina = 10;
  idUsuarioSelecionado = 0;
  acaoItens: MenuItem[];
  alturaJanela = 0;
  totalRegistros = 0;
  filtro: UsuarioFiltro;

  @ViewChild('grid') grid: Table;

  constructor(
    private utilService: UtilService,
    public auth: AuthService,
    private usuarioService: UsuarioService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private msgService: MensagemService,
    private confirmation: ConfirmationService) {
      this.filtro = usuarioService.getFiltro();
  }

  ngOnInit() {
    this.alturaJanela = window.innerHeight;
    this.calculaLinhasGrid();
    this.configuraAcoes();
    this.filtro.login = '';
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
    this.usuarioService.consultar(this.filtro)
      .then(resultado => {
        this.usuarios = resultado.usuarios;
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
          this.router.navigate(['/usuarios/', this.idUsuarioSelecionado.toString(), 'consulta']);
        }
      },

      {
        label: 'Alterar',
        icon: 'pi pi-pencil',
        disabled: !this.auth.temPermissao('ROLE_ALTERAR_USUARIO'),
        command: () => {
          if (this.idUsuarioSelecionado === 1) {
            this.msgService.erro('Usuário não pode ser alterado');
          } else {
            this.router.navigate(['/usuarios/', this.idUsuarioSelecionado.toString()]);
          }
        }
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        disabled: !this.auth.temPermissao('ROLE_EXCLUIR_USUARIO'),
        command: () => {
          if (this.idUsuarioSelecionado === 1) {
            this.msgService.erro('Usuário não pode ser excluído');
          } else {
            this.confirmarExclusao(this.idUsuarioSelecionado);
          }
        }
      }
    ];
  }

  public acoesDropDownClick(idUsuarioSelecionado) {
    this.idUsuarioSelecionado = idUsuarioSelecionado;
  }

  confirmarExclusao(idUsuario: any) {
    this.confirmation.confirm({
      message: 'Confirma exclusão?',
      accept: () => {
        this.excluir(idUsuario);
      }
    });
  }

  excluir(id: Number) {
    this.usuarioService.excluir(id)
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

  alternarInativo(usuario: Usuario) {
    const novoStatus = !usuario.inativo;
    this.usuarioService.atualizarPropriedadeInativo(usuario.id, novoStatus)
    .then(() => {
      usuario.inativo = novoStatus;
      this.msgService.sucesso('Registro atualizado com sucesso.');
    }).catch(error => this.errorHandler.handle(error));

  }
  buscarCorInativo(inativo: boolean) {
    if (inativo) {
      return { 'color': 'red' };
    } else {
      return { 'color': 'blue' };
    }
  }
}
