/* eslint-disable react/no-array-index-key */
/**
 * Módulo de configuração das rotas da plataforma
 * @module Routes
 * @category Rotas
 */

import React from 'react';

import AcessDenied from '../pages/AcessDenied';
import Agenda from '../pages/Agenda';
import Atendente from '../pages/Atendente';
import Cliente from '../pages/Cliente';
import Conta from '../pages/Conta';
import DuplicataPagar from '../pages/DuplicataPagar';
import Entrada from '../pages/Entradas';
import FormaPagamento from '../pages/FormaPagamento';
import Fornecedor from '../pages/Fornecedor';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProdutoServico from '../pages/ProdutoServico';
import Usuario from '../pages/Usuario';
import Switch from './Switch';

/**
 * Componente de rotas
 * @func Routes
 */
export default function Routes() {
  const routes: any[] = [];

  routes.push({ path: '/', element: <Login /> });
  routes.push({ path: '/login', element: <Login /> });
  routes.push({ path: '/home', element: <Home />, isPrivate: true });

  /* clientes  */
  routes.push({
    path: '/clientes',
    element: <Cliente />,
    roles: ['ROLE_LER_USUARIO'],
    isPrivate: true,
  });
  routes.push({
    path: '/clientes/:option',
    element: <Cliente />,
    roles: ['ROLE_LER_USUARIO', 'ROLE_INSERIR_USUARIO', 'ROLE_ALTERAR_USUARIO'],
    isPrivate: true,
  });

  /* contas  */
  routes.push({
    path: '/contas',
    element: <Conta />,
    roles: ['ROLE_LER_CONTA'],
    isPrivate: true,
  });
  routes.push({
    path: '/contas/:option',
    element: <Conta />,
    roles: ['ROLE_LER_CONTA', 'ROLE_INSERIR_CONTA', 'ROLE_ALTERAR_CONTA'],
    isPrivate: true,
  });

  /* produtoServico  */
  routes.push({
    path: '/produtosServicos',
    element: <ProdutoServico />,
    roles: ['ROLE_LER_PRODUTO_SERVICO'],
    isPrivate: true,
  });
  routes.push({
    path: '/produtosServicos/:option',
    element: <ProdutoServico />,
    roles: [
      'ROLE_LER_PRODUTO_SERVICO',
      'ROLE_INSERIR_PRODUTO_SERVICO',
      'ROLE_ALTERAR_PRODUTO_SERVICO',
    ],
    isPrivate: true,
  });

  /* Forma pagamento  */
  routes.push({
    path: '/formasPagamento',
    element: <FormaPagamento />,
    roles: ['ROLE_LER_FORMA_PAGAMENTO'],
    isPrivate: true,
  });
  routes.push({
    path: '/formasPagamento/:option',
    element: <FormaPagamento />,
    roles: [
      'ROLE_LER_FORMA_PAGAMENTO',
      'ROLE_INSERIR_FORMA_PAGAMENTO',
      'ROLE_ALTERAR_FORMA_PAGAMENTO',
    ],
    isPrivate: true,
  });

  /* Atendente  */
  routes.push({
    path: '/atendentes',
    element: <Atendente />,
    roles: ['ROLE_LER_ATENDENTE'],
    isPrivate: true,
  });
  routes.push({
    path: '/atendentes/:option',
    element: <Atendente />,
    roles: ['ROLE_LER_ATENDENTE', 'ROLE_INSERIR_ATENDENTE', 'ROLE_ALTERAR_ATENDENTE'],
    isPrivate: true,
  });

  /* Fornecedor  */
  routes.push({
    path: '/fornecedores',
    element: <Fornecedor />,
    roles: ['ROLE_LER_FORNECEDOR'],
    isPrivate: true,
  });
  routes.push({
    path: '/fornecedores/:option',
    element: <Fornecedor />,
    roles: ['ROLE_LER_FORNECEDOR', 'ROLE_INSERIR_FORNECEDOR', 'ROLE_ALTERAR_FORNECEDOR'],
    isPrivate: true,
  });

  /* Duplicata pagar  */
  routes.push({
    path: '/duplicatasPagar',
    element: <DuplicataPagar />,
    roles: ['ROLE_LER_DUPLICATA_PAGAR'],
    isPrivate: true,
  });
  routes.push({
    path: '/duplicatasPagar/:option',
    element: <DuplicataPagar />,
    roles: [
      'ROLE_LER_DUPLICATA_PAGAR',
      'ROLE_INSERIR_DUPLICATA_PAGAR',
      'ROLE_ALTERAR_DUPLICATA_PAGAR',
    ],
    isPrivate: true,
  });

  /* Usuario  */
  routes.push({
    path: '/usuarios',
    element: <Usuario />,
    roles: ['ROLE_LER_USUARIO'],
    isPrivate: true,
  });
  routes.push({
    path: '/usuarios/:option',
    element: <Usuario />,
    roles: ['ROLE_LER_USUARIO', 'ROLE_INSERIR_USUARIO', 'ROLE_ALTERAR_USUARIO'],
    isPrivate: true,
  });

  /* Agenda  */
  routes.push({
    path: '/agendas',
    element: <Agenda />,
    roles: ['ROLE_LER_AGENDA'],
    isPrivate: true,
  });
  routes.push({
    path: '/agendas/:option',
    element: <Agenda />,
    roles: ['ROLE_LER_AGENDA', 'ROLE_INSERIR_AGENDA', 'ROLE_ALTERAR_AGENDA'],
    isPrivate: true,
  });

  /* entradas  */
  routes.push({
    path: '/entradas',
    element: <Entrada />,
    roles: ['ROLE_LER_ENTRADA'],
    isPrivate: true,
  });
  routes.push({
    path: '/entradas/:option',
    element: <Entrada />,
    roles: ['ROLE_LER_ENTRADA', 'ROLE_INSERIR_ENTRADA', 'ROLE_ALTERAR_ENTRADA'],
    isPrivate: true,
  });

  routes.push({ path: '/denied', element: <AcessDenied />, isPrivate: true });
  routes.push({ path: '*', element: <NotFound />, isPrivate: true });

  return <Switch routes={routes} />;
}
