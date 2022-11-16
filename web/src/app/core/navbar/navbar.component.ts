import { Router, RouterLink } from '@angular/router';

import { MenuItem } from 'primeng/components/common/api';

import { ErrorHandlerService } from './../error-handler.service';
import { LogoutService } from './../../seguranca/logout.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/shared/util.service';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  exibindoMenu = false;
  nomeEstilo = 'navbar-menu';
  menuItens: MenuItem[];

  constructor(private logoutService: LogoutService,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    public auth: AuthService,
    public utilService: UtilService) {

  }

  ngOnInit() {
    this.criaMenu();
  }

  logout() {
    if (this.auth.isAccessTokenInvalido()) {
      this.router.navigate(['/login']);
    } else {
      try {
        this.logoutService.logout();
      } catch (error) {
        this.errorHandlerService.handle(error);
      }
    }
  }
  consultorVenda() {
    return this.auth.perfilUsuario() === 'CONSULTOR'
      && this.auth.jwtPayload.usuario.regional;
  }

  criaMenu() {
    this.menuItens = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        expanded: false,
        command: () => {
          this.exibindoMenu = false;
          this.router.navigate(['/home']);
          this.menuItens[0].expanded = false;
        }
      },
      {
        label: 'Agendamento',
        icon: 'pi pi-calendar',
        disabled: !this.auth.temPermissao('ROLE_LER_AGENDAMENTO'),
        command: () => {
          this.exibindoMenu = false;
          this.router.navigate(['/agendamentoAgenda']);
        }
      },
      {
        label: 'Gerencia Agendamento',
        icon: 'pi pi-cog',
        disabled: !this.auth.temPermissao('ROLE_LER_AGENDAMENTO'),
        command: () => {
          this.exibindoMenu = false;
          this.router.navigate(['/agendamentos']);
        }
      },

      {
        label: 'Cadastros',
        icon: 'pi pi-folder-open',
        visible: true,
        items: [
          {
            label: 'Pessoas',
            icon: 'pi pi-folder',
            items: [
              {
                label: 'Atendentes',
                icon: 'pi pi-user',
                disabled: !this.auth.temPermissao('ROLE_LER_ATENDENTE'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/atendentes']);
                }
              },
              {
                label: 'Clientes',
                icon: 'pi pi-user',
                disabled: !this.auth.temPermissao('ROLE_LER_CLIENTE'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/clientes']);
                }
              },
              {
                label: 'Fornecedores',
                icon: 'pi pi-user',
                disabled: !this.auth.temPermissao('ROLE_LER_FORNECEDOR'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/fornecedores']);
                }
              },
              {
                label: 'Usuários',
                icon: 'pi pi-users',
                disabled: !this.auth.temPermissao('ROLE_LER_USUARIO'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/usuarios']);
                }
              },
              {
                label: 'Alterar Senha',
                disabled: !this.auth.temPermissao('ROLE_ALTERAR_SENHA_USUARIO'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/usuario-senha']);
                }
              }
            ]
          },
          {
            label: 'Outros',
            icon: 'pi pi-folder',
            items: [
              {
                label: 'Contas',
                icon: 'pi pi-user',
                disabled: !this.auth.temPermissao('ROLE_LER_CONTA'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/contas']);
                }
              },
              {
                label: 'Produtos/Serviços',
                icon: 'pi pi-user',
                disabled: !this.auth.temPermissao('ROLE_LER_PRODUTO_SERVICO'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/produtosServicos']);
                }
              },
              {
                label: 'Formas Pagamento',
                icon: 'pi pi-user',
                disabled: !this.auth.temPermissao('ROLE_LER_FORMA_PAGAMENTO'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/formasPagamento']);
                }
              },
              {
                label: 'Agendas',
                icon: 'pi pi-user',
                disabled: !this.auth.temPermissao('ROLE_LER_AGENDA'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/agendas']);
                }
              },
            ]
          },

        ]
      },
      {
        label: 'Lançamentos',
        icon: 'pi pi-align-justify',
        items: [
          {
            label: 'Financeiro',
            icon: 'pi pi-briefcase',
            items: [
              {
                label: 'Contas a Receber',
                disabled: !this.auth.temPermissao('ROLE_LER_PARCELA_RECEBER'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/parcelas-receber']);
                }
              },
              {
                label: 'Contas a Pagar',
                disabled: !this.auth.temPermissao('ROLE_LER_DUPLICATA_PAGAR'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/duplicatasPagar']);
                }
              },
              {
                label: 'Movimentação Contas',
                disabled: !this.auth.temPermissao('ROLE_LER_MOVIMENTACAO_CONTA'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/movimentacoesContas']);
                }
              },
            ],
          },
          {
            label: 'Atendimento',
            icon: 'pi pi-briefcase',
            items: [
              {
                label: 'Agendamento',
                disabled: !this.auth.temPermissao('ROLE_LER_AGENDAMENTO'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/agendamentoAgenda']);
                }
              },
              {
                label: 'Gerencia Agendamento',
                disabled: !this.auth.temPermissao('ROLE_LER_AGENDAMENTO'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/agendamentos']);
                }
              },
            ],
          },
          {
            label: 'Estoque',
            icon: 'pi pi-briefcase',
            items: [
              {
                label: 'Entrada',
                disabled: !this.auth.temPermissao('ROLE_LER_ENTRADA'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/entradas']);
                }
              },
            ],
          },
        ]
      },
      {
        label: 'Relatórios',
        icon: 'pi pi-list',
        items: [
          {
            label: 'Financeiro',
            icon: 'pi pi-print',
            items: [
              {
                label: 'Contas a Pagar',
                disabled: !this.auth.temPermissao('ROLE_LER_PARCELA_PAGAR'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/relatorios/pagar-rel']);
                }
              },
              {
                label: 'Contas a Receber',
                disabled: !this.auth.temPermissao('ROLE_LER_PARCELA_RECEBER'),
                command: () => {
                  this.exibindoMenu = false;
                  this.router.navigate(['/relatorios/receber-rel']);
                }
              },
            ]
          },
        ]
      },
      {
        label: 'Sair',
        icon: 'pi pi-power-off',
        command: () => {
          this.exibindoMenu = false;
          this.menuItens[4].expanded = false;
          this.logout();
        }
      }
    ];
  }

  styleSideBar() {
    if (this.utilService.telaMobile()) {
      return { width: '15em', padding: '0px', overflowX: 'hidden', overflowY: 'auto' };
    } else {
      return { width: '15em', padding: '0px', overflowX: 'hidden', overflowY: 'auto' };
    }
  }
}
