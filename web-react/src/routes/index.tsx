/* eslint-disable react/no-array-index-key */
/**
 * Módulo de configuração das rotas da plataforma
 * @module Routes
 * @category Rotas
 */

import React from 'react';

import AcessDenied from '../pages/AcessDenied';
import Cliente from '../pages/Cliente';
import Conta from '../pages/Conta';
import FormaPagamento from '../pages/FormaPagamento';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProdutoServico from '../pages/ProdutoServico';
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

  routes.push({ path: '/denied', element: <AcessDenied />, isPrivate: true });
  routes.push({ path: '*', element: <NotFound />, isPrivate: true });

  return <Switch routes={routes} />;
}
