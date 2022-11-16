// import PerfilUsuario from '../app/models/utils/PerfilUsuario';

const roles = ['LER', 'ALTERAR', 'INSERIR', 'EXCLUIR'];
const routes = [
  'USUARIO',
  'EMPRESA',
  'AGENDA',
  'AGENDAMENTO',
  'PESSOA',
  'CONTA',
  'CLIENTE',
  'ATENDENTE',
  'CONTA',
  'DUPLICATA_PAGAR',
  'ENTRADA',
  'FORMA_PAGAMENTO',
  'FORNECEDOR',
  'MOVIMENTACAO_CONTA',
  'PRODUTO_SERVICO',
];

function getRolesFromRoute(routeNames: string[] = [], _roles = roles): string[] {
  let retorno: string[] = [];

  routeNames.forEach((r) => {
    if (routes.includes(r)) {
      const role = _roles.map((e) => `ROLE_${e}_${r}`);
      retorno = retorno.concat(role);
    }
  });
  return retorno;
}

function getAllRoles(): string[] {
  const retorno: string[] = [];
  return retorno.concat(getRolesFromRoute(routes, roles));
}

export function getRoles(tipoUsuario: string): any[] {
  const tipo = tipoUsuario; // PerfilUsuario[tipoUsuario];

  let roleReturn: any[] = [];
  switch (tipo) {
    case 'ADMINISTRADOR': // administrador
      return getAllRoles();
    case 'GERENTE':
      return getAllRoles();

    case 'FUNCIONARIO':
      roleReturn = [];
      roleReturn = roleReturn.concat(getRolesFromRoute(['USUARIO'], ['LER', 'ALTERAR']));
      roleReturn = roleReturn.concat(getRolesFromRoute(['CONTA'], ['LER']));

      return roleReturn;

    default:
      return [];
  }
}
