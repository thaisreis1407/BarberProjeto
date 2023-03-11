import { Router } from 'express';

import AgendaController from './app/controllers/AgendaController';
import AgendamentoController from './app/controllers/AgendamentoController';
import AtendenteController from './app/controllers/AtendenteController';
import ClienteController from './app/controllers/ClienteController';
import ContaController from './app/controllers/ContaController';
import DuplicataPagarController from './app/controllers/DuplicataPagarController';
import EntradaController from './app/controllers/EntradaController';
import FormaPagamentoController from './app/controllers/FormaPagamentoController';
import FornecedorController from './app/controllers/FornecedorController';
import MovimentacaoContaController from './app/controllers/MovimentacaoContaController';
import ProdutoServicoController from './app/controllers/ProdutoServicoController';
import SessionController from './app/controllers/SessionController';
import UsuarioController from './app/controllers/UsuarioController';
import auth from './app/controllers/util/security';
import authMiddleware from './app/middlewares/auth';
import dataBaseMiddleware from './app/middlewares/db';

const routes = Router();

let name = '';

routes.use(dataBaseMiddleware); // configura a conexão padrão

routes.post('/oauth/token', SessionController.store);
routes.delete('/tokens/revoke', SessionController.revok);

routes.use(authMiddleware);

// usuarios
name = 'USUARIO';
routes.get('/usuarios', auth(`ROLE_LER_${name}`), UsuarioController.index);
routes.get('/usuarios/:id', auth(`ROLE_LER_${name}`), UsuarioController.index);
routes.post('/usuarios', auth(`ROLE_INSERIR_${name}`), UsuarioController.store);
routes.put('/usuarios/:id', auth(`ROLE_ALTERAR_${name}`), UsuarioController.update);
routes.delete('/usuarios/:id', auth(`ROLE_EXCLUIR_${name}`), UsuarioController.delete);

name = 'AGENDA';
routes.get('/agendas', auth(`ROLE_LER_${name}`), AgendaController.index);
routes.get('/agendas/:id', auth(`ROLE_LER_${name}`), AgendaController.index);
routes.post('/agendas', auth(`ROLE_INSERIR_${name}`), AgendaController.store);
routes.put('/agendas/:id', auth(`ROLE_ALTERAR_${name}`), AgendaController.update);
routes.delete('/agendas/:id', auth(`ROLE_EXCLUIR_${name}`), AgendaController.delete);

name = 'AGENDAMENTO';
routes.get('/agendamentos', auth(`ROLE_LER_${name}`), AgendamentoController.index);
routes.get('/agendamentos/:id', auth(`ROLE_LER_${name}`), AgendamentoController.index);
routes.post('/agendamentos', auth(`ROLE_INSERIR_${name}`), AgendamentoController.store);
routes.put('/agendamentos/:id', auth(`ROLE_ALTERAR_${name}`), AgendamentoController.update);
routes.delete('/agendamentos/:id', auth(`ROLE_EXCLUIR_${name}`), AgendamentoController.delete);
routes.put(
  '/agendamentos/:id/abrirAtendimento',
  auth(`ROLE_ALTERAR_${name}`),
  AgendamentoController.abrirAtendimento
);
routes.put(
  '/agendamentos/:id/excluirAtendimento',
  auth(`ROLE_ALTERAR_${name}`),
  AgendamentoController.excluirAtendimento
);

name = 'CLIENTE';
routes.get('/clientes', auth(`ROLE_LER_${name}`), ClienteController.index);
routes.get('/clientes/:id', auth(`ROLE_LER_${name}`), ClienteController.index);
routes.post('/clientes', auth(`ROLE_INSERIR_${name}`), ClienteController.store);
routes.put('/clientes/:id', auth(`ROLE_ALTERAR_${name}`), ClienteController.update);
routes.delete('/clientes/:id', auth(`ROLE_EXCLUIR_${name}`), ClienteController.delete);

name = 'ATENDENTE';
routes.get('/atendentes', auth(`ROLE_LER_${name}`), AtendenteController.index);
routes.get('/atendentes/:id', auth(`ROLE_LER_${name}`), AtendenteController.index);
routes.post('/atendentes', auth(`ROLE_INSERIR_${name}`), AtendenteController.store);
routes.put('/atendentes/:id', auth(`ROLE_ALTERAR_${name}`), AtendenteController.update);
routes.delete('/atendentes/:id', auth(`ROLE_EXCLUIR_${name}`), AtendenteController.delete);

name = 'CONTA';
routes.get('/contas', auth(`ROLE_LER_${name}`), ContaController.index);
routes.get('/contas/:id', auth(`ROLE_LER_${name}`), ContaController.index);
routes.post('/contas', auth(`ROLE_INSERIR_${name}`), ContaController.store);
routes.put('/contas/:id', auth(`ROLE_ALTERAR_${name}`), ContaController.update);
routes.delete('/contas/:id', auth(`ROLE_EXCLUIR_${name}`), ContaController.delete);

name = 'DUPLICATA_PAGAR';
routes.get('/duplicatasPagar', auth(`ROLE_LER_${name}`), DuplicataPagarController.index);
routes.get('/duplicatasPagar/:id', auth(`ROLE_LER_${name}`), DuplicataPagarController.index);
routes.post('/duplicatasPagar', auth(`ROLE_INSERIR_${name}`), DuplicataPagarController.store);
routes.put(
  '/duplicatasPagar/:id',
  auth(`ROLE_ALTERAR_${name}`),
  DuplicataPagarController.update
);
// fff
routes.put(
  '/duplicatasPagarQuitar/:id',
  auth(`ROLE_ALTERAR_${name}`),
  DuplicataPagarController.quitar
);
routes.put(
  '/duplicatasPagarEstornar/:id',
  auth(`ROLE_ALTERAR_${name}`),
  DuplicataPagarController.estornar
);
routes.delete(
  '/duplicatasPagar/:id',
  auth(`ROLE_EXCLUIR_${name}`),
  DuplicataPagarController.delete
);

name = 'ENTRADA';
routes.get('/entradas', auth(`ROLE_LER_${name}`), EntradaController.index);
routes.get('/entradas/:id', auth(`ROLE_LER_${name}`), EntradaController.index);
routes.post('/entradas', auth(`ROLE_INSERIR_${name}`), EntradaController.store);
routes.put('/entradas/:id', auth(`ROLE_ALTERAR_${name}`), EntradaController.update);
routes.delete('/entradas/:id', auth(`ROLE_EXCLUIR_${name}`), EntradaController.delete);

name = 'FORMA_PAGAMENTO';
routes.get('/formasPagamento', auth(`ROLE_LER_${name}`), FormaPagamentoController.index);
routes.get('/formasPagamento/:id', auth(`ROLE_LER_${name}`), FormaPagamentoController.index);
routes.post('/formasPagamento', auth(`ROLE_INSERIR_${name}`), FormaPagamentoController.store);
routes.put(
  '/formasPagamento/:id',
  auth(`ROLE_ALTERAR_${name}`),
  FormaPagamentoController.update
);
routes.delete(
  '/formasPagamento/:id',
  auth(`ROLE_EXCLUIR_${name}`),
  FormaPagamentoController.delete
);

name = 'FORNECEDOR';
routes.get('/fornecedores', auth(`ROLE_LER_${name}`), FornecedorController.index);
routes.get('/fornecedores/:id', auth(`ROLE_LER_${name}`), FornecedorController.index);
routes.post('/fornecedores', auth(`ROLE_INSERIR_${name}`), FornecedorController.store);
routes.put('/fornecedores/:id', auth(`ROLE_ALTERAR_${name}`), FornecedorController.update);
routes.delete('/fornecedores/:id', auth(`ROLE_EXCLUIR_${name}`), FornecedorController.delete);

name = 'MOVIMENTACAO_CONTA';
routes.get(
  '/movimentacoesContas',
  auth(`ROLE_LER_${name}`),
  MovimentacaoContaController.index
);
routes.get(
  '/movimentacoesContas/:id',
  auth(`ROLE_LER_${name}`),
  MovimentacaoContaController.index
);
routes.post(
  '/movimentacoesContas',
  auth(`ROLE_INSERIR_${name}`),
  MovimentacaoContaController.store
);
routes.put(
  '/movimentacoesContas/:id',
  auth(`ROLE_ALTERAR_${name}`),
  MovimentacaoContaController.update
);
routes.delete(
  '/movimentacoesContas/:id',
  auth(`ROLE_EXCLUIR_${name}`),
  MovimentacaoContaController.delete
);

name = 'PRODUTO_SERVICO';
routes.get('/produtosServicos', auth(`ROLE_LER_${name}`), ProdutoServicoController.index);
routes.get('/produtosServicos/:id', auth(`ROLE_LER_${name}`), ProdutoServicoController.index);
routes.post('/produtosServicos', auth(`ROLE_INSERIR_${name}`), ProdutoServicoController.store);
routes.put(
  '/produtosServicos/:id',
  auth(`ROLE_ALTERAR_${name}`),
  ProdutoServicoController.update
);
routes.delete(
  '/produtosServicos/:id',
  auth(`ROLE_EXCLUIR_${name}`),
  ProdutoServicoController.delete
);

export default routes;
