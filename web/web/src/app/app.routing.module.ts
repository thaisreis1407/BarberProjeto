import { ProdutoServicoPesquisaComponent } from './modulos/produtos-servicos/produto-servico-pesquisa/produto-servico-pesquisa.component';
import { ProdutoServicoCadastroComponent } from './modulos/produtos-servicos/produto-servico-cadastro/produto-servico-cadastro.component';
import { Servico } from './core/model';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';
import { NaoAutorizadoComponent } from './core/nao-autorizado.component';
import { HomeComponent } from './core/home/home.component';
import { UsuarioSenhaComponent } from './modulos/usuarios/usuario-senha/usuario-senha.component';
import { AuthGuard } from './seguranca/auth.guard';
import { ClienteCadastroComponent } from './modulos/clientes/cliente-cadastro/cliente-cadastro.component';
import { ClientePesquisaComponent } from './modulos/clientes/cliente-pesquisa/cliente-pesquisa.component';
import { UsuarioCadastroComponent } from './modulos/usuarios/usuario-cadastro/usuario-cadastro.component';
import { UsuarioPesquisaComponent } from './modulos/usuarios/usuario-pesquisa/usuario-pesquisa.component';
import { FornecedorCadastroComponent } from './modulos/fornecedores/fornecedor-cadastro/fornecedor-cadastro.component';
import { FornecedorPesquisaComponent } from './modulos/fornecedores/fornecedor-pesquisa/fornecedor-pesquisa.component';
import { ContaCadastroComponent } from './modulos/contas/conta-cadastro/conta-cadastro.component';
import { ContaPesquisaComponent } from './modulos/contas/conta-pesquisa/conta-pesquisa.component';
import { FormaPagamentoCadastroComponent } from './modulos/formas-pagamento/forma-pagamento-cadastro/forma-pagamento-cadastro.component';
import { FormaPagamentoPesquisaComponent } from './modulos/formas-pagamento/forma-pagamento-pesquisa/forma-pagamento-pesquisa.component';
// tslint:disable-next-line: max-line-length
import { MovimentacaoContaCadastroComponent } from './modulos/movimentacoes-conta/movimentacao-conta-cadastro/movimentacao-conta-cadastro.component';
// tslint:disable-next-line: max-line-length
import { MovimentacaoContaPesquisaComponent } from './modulos/movimentacoes-conta/movimentacao-conta-pesquisa/movimentacao-conta-pesquisa.component';
import { AtendenteCadastroComponent } from './modulos/atendentes/atendente-cadastro/atendente-cadastro.component';
import { AtendentePesquisaComponent } from './modulos/atendentes/atendente-pesquisa/atendente-pesquisa.component';
import { DuplicataPagarCadastroComponent } from './modulos/duplicatas-pagar/duplicata-pagar-cadastro/duplicata-pagar-cadastro.component';
import { DuplicataPagarPesquisaComponent } from './modulos/duplicatas-pagar/duplicata-pagar-pesquisa/duplicata-pagar-pesquisa.component';
import { AgendaCadastroComponent } from './modulos/agendas/agenda-cadastro/agenda-cadastro.component';
import { AgendaPesquisaComponent } from './modulos/agendas/agenda-pesquisa/agenda-pesquisa.component';
import { AgendamentoPesquisaComponent } from './modulos/agendamento/agendamento-pesquisa/agendamento-pesquisa.component';
import { AgendamentoCadastroComponent } from './modulos/agendamento/agendamento-cadastro/agendamento-cadastro.component';
import { AgendamentoAgendaComponent } from './modulos/agendamento/agendamento-agenda/agendamento-agenda.component';
import { EntradaCadastroComponent } from './modulos/entradas/entrada-cadastro/entrada-cadastro.component';
import { EntradaPesquisaComponent } from './modulos/entradas/entrada-pesquisa/entrada-pesquisa.component';

const rotas: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // usuarios
  {
    path: 'usuarios',
    component: UsuarioPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_USUARIO']}
  },
  {
    path: 'usuarios/:id/:consulta', component: UsuarioCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_USUARIO']}
  },
  {
    path: 'usuarios/novo', component: UsuarioCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_USUARIO']}
  },
  {
    path: 'usuarios/:id', component: UsuarioCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_USUARIO']}
  },

  { path: 'usuario-senha', component: UsuarioSenhaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_SENHA_USUARIO']}
  },

  // clientes
  {
    path: 'clientes',
    component: ClientePesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_CLIENTE']}
  },
  {
    path: 'clientes/:id/:consulta', component: ClienteCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_CLIENTE']}
  },
  {
    path: 'clientes/novo', component: ClienteCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_CLIENTE']}
  },
  {
    path: 'clientes/:id', component: ClienteCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_CLIENTE']}
  },

  // fornecedores
  {
    path: 'fornecedores',
    component: FornecedorPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_FORNECEDOR']}
  },
  {
    path: 'fornecedores/:id/:consulta', component: FornecedorCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_FORNECEDOR']}
  },
  {
    path: 'fornecedores/novo', component: FornecedorCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_FORNECEDOR']}
  },
  {
    path: 'fornecedores/:id', component: FornecedorCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_FORNECEDOR']}
  },

  // forma de pagamento
  {
    path: 'formasPagamento',
    component: FormaPagamentoPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_FORMA_PAGAMENTO']}
  },
  {
    path: 'formasPagamento/:id/:consulta', component: FormaPagamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_FORMA_PAGAMENTO']}
  },
  {
    path: 'formasPagamento/novo', component: FormaPagamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_FORMA_PAGAMENTO']}
  },
  {
    path: 'formasPagamento/:id', component: FormaPagamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_FORMA_PAGAMENTO']}
  },

  // duplicata pagar
  {
    path: 'duplicatasPagar',
    component: DuplicataPagarPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_DUPLICATA_PAGAR']}
  },
  {
    path: 'duplicatasPagar/:id/:consulta', component: DuplicataPagarCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_DUPLICATA_PAGAR']}
  },
  {
    path: 'duplicatasPagar/novo', component: DuplicataPagarCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_DUPLICATA_PAGAR']}
  },
  {
    path: 'duplicatasPagar/:id', component: DuplicataPagarCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_DUPLICATA_PAGAR']}
  },


  // Movimentacoes Conta
  {
    path: 'movimentacoesContas',
    component: MovimentacaoContaPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_MOVIMENTACAO_CONTA']}
  },
  {
    path: 'movimentacoesContas/:id/:consulta', component: MovimentacaoContaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_MOVIMENTACAO_CONTA']}
  },
  {
    path: 'movimentacoesContas/novo', component: MovimentacaoContaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_MOVIMENTACAO_CONTA']}
  },
  {
    path: 'movimentacoesContas/:id', component: MovimentacaoContaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_MOVIMENTACAO_CONTA']}
  },


  // contas
  {
    path: 'contas',
    component: ContaPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_CONTA']}
  },
  {
    path: 'contas/:id/:consulta', component: ContaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_CONTA']}
  },
  {
    path: 'contas/novo', component: ContaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_CONTA']}
  },
  {
    path: 'contas/:id', component: ContaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_CONTA']}
  },


    // produtos
    {
      path: 'produtosServicos',
      component: ProdutoServicoPesquisaComponent,
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_LER_PRODUTO_SERVICO']}
    },
    {
      path: 'produtosServicos/:id/:consulta', component: ProdutoServicoCadastroComponent,
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_LER_PRODUTO_SERVICO']}
    },
    {
      path: 'produtosServicos/novo', component: ProdutoServicoCadastroComponent,
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_INSERIR_PRODUTO_SERVICO']}
    },
    {
      path: 'produtosServicos/:id', component: ProdutoServicoCadastroComponent,
      canActivate: [AuthGuard],
      data: { roles: ['ROLE_ALTERAR_PRODUTO_SERVICO']}
    },

  // agenda
  {
    path: 'agendas',
    component: AgendaPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_AGENDA']}
  },
  {
    path: 'agendas/:id/:consulta', component: AgendaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_AGENDA']}
  },
  {
    path: 'agendas/novo', component: AgendaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_AGENDA']}
  },
  {
    path: 'agendas/:id', component: AgendaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_AGENDA']}
  },


  // atendentes
  {
    path: 'atendentes',
    component: AtendentePesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_ATENDENTE']}
  },
  {
    path: 'atendentes/:id/:consulta', component: AtendenteCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_ATENDENTE']}
  },
  {
    path: 'atendentes/novo', component: AtendenteCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_ATENDENTE']}
  },
  {
    path: 'atendentes/:id', component: AtendenteCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_ATENDENTE']}
  },

  // agenda
  {
    path: 'agendas',
    component: AgendaPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_AGENDA']}
  },
  {
    path: 'agendas/:id/:consulta', component: AgendaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_AGENDA']}
  },
  {
    path: 'agendas/novo', component: AgendaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_AGENDA']}
  },
  {
    path: 'agendas/:id', component: AgendaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_AGENDA']}
  },

  // agendamento
  {
    path: 'agendamentos',
    component: AgendamentoPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_AGENDAMENTO']}
  },
  {
    path: 'agendamentoAgenda',
    component: AgendamentoAgendaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_AGENDAMENTO']}
  },
  {
    path: 'agendamentos/:id/:consulta', component: AgendamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_AGENDAMENTO']}
  },
  {
    path: 'agendamentos/novo', component: AgendamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_AGENDAMENTO']}
  },
  {
    path: 'agendamentos/:id', component: AgendamentoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_AGENDAMENTO']}
  },

  // Entrada

  {
    path: 'entradas',
    component: EntradaPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_ENTRADA']}
  },
  {
    path: 'entradas/:id/:consulta', component: EntradaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_LER_ENTRADA']}
  },
  {
    path: 'entradas/novo', component: EntradaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_INSERIR_ENTRADA']}
  },
  {
    path: 'entradas/:id', component: EntradaCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ALTERAR_ENTRADA']}
  },


  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },

  { path: 'home', component: HomeComponent,
    canActivate: [AuthGuard]
  },

  { path: 'nao-autorizado', component: NaoAutorizadoComponent },
  { path: '**', redirectTo: 'pagina-nao-encontrada'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(rotas)
  ],
  providers: [

  ],
  exports: [
    RouterModule
  ]

})
export class AppRoutingModule { }
