import { useNavigate } from 'react-router-dom';

import AuthService from '../services/AuthService';

type HandleExibindoMenu = (visible: boolean) => void;

export default function createMenu(setExibindoMenu: HandleExibindoMenu): any[] {
  const navigate = useNavigate();

  // const menuReturn: any = [
  //   {
  //     label: 'Home',
  //     title: 'Home',
  //     icon: 'pi pi-fw pi-home',
  //     to: '/home',
  //     command: () => setExibindoMenu(false),
  //   },
  //   {
  //     label: 'Mesas',
  //     title: 'Mesas',
  //     icon: 'pi pi-fw pi-table',
  //     to: '/mesas',
  //   },
  // ];

  const menuReturn: any = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      expanded: false,

      command: (): void => {
        navigate('/home');
        setExibindoMenu(false);
      },
    },
    {
      label: 'Agendamento',
      icon: 'pi pi-calendar',
      disabled: !AuthService.checkRoles('ROLE_LER_AGENDAMENTO'),
      command: (): void => {
        navigate('/agendamentoAgenda');
        setExibindoMenu(false);
      },
    },
    {
      label: 'Gerencia Agendamento',
      icon: 'pi pi-cog',
      disabled: !AuthService.checkRoles('ROLE_LER_AGENDAMENTO'),
      command: (): void => {
        navigate('/agendamentos');
        setExibindoMenu(false);
      },
    },
    {
      label: 'Cadastros',
      icon: 'pi pi-folder-open',

      items: [
        {
          label: 'Pessoas',
          icon: 'pi pi-folder',
          items: [
            {
              label: 'Atendentes',
              icon: 'pi pi-user',
              disabled: !AuthService.checkRoles('ROLE_LER_ATENDENTE'),
              command: (): void => {
                navigate('/atendentes');
                setExibindoMenu(false);
              },
            },
            {
              label: 'Clientes',
              icon: 'pi pi-user',
              disabled: !AuthService.checkRoles('ROLE_LER_CLIENTE'),
              command: (): void => {
                navigate('/clientes');
                setExibindoMenu(false);
              },
            },
            {
              label: 'Fornecedores',
              icon: 'pi pi-user',
              disabled: !AuthService.checkRoles('ROLE_LER_FORNECEDOR'),
              command: (): void => {
                navigate('/fornecedores');
                setExibindoMenu(false);
              },
            },
            {
              label: 'Usuários',
              icon: 'pi pi-users',
              disabled: !AuthService.checkRoles('ROLE_LER_USUARIO'),
              command: (): void => {
                navigate('/usuarios');
                setExibindoMenu(false);
              },
            },
            {
              label: 'Alterar Senha',
              disabled: !AuthService.checkRoles('ROLE_ALTERAR_SENHA_USUARIO'),
              command: (): void => {
                navigate('/usuario-senha');
                setExibindoMenu(false);
              },
            },
          ],
        },
        {
          label: 'Outros',
          icon: 'pi pi-folder',
          items: [
            {
              label: 'Contas',
              icon: 'pi pi-user',
              disabled: !AuthService.checkRoles('ROLE_LER_CONTA'),
              command: (): void => {
                navigate('/contas');
                setExibindoMenu(false);
              },
            },
            {
              label: 'Produtos/Serviços',
              icon: 'pi pi-user',
              disabled: !AuthService.checkRoles('ROLE_LER_PRODUTO_SERVICO'),
              command: (): void => {
                navigate('/produtosServicos');
                setExibindoMenu(false);
              },
            },
            {
              label: 'Formas Pagamento',
              icon: 'pi pi-user',
              disabled: !AuthService.checkRoles('ROLE_LER_FORMA_PAGAMENTO'),
              command: (): void => {
                navigate('/formasPagamento');
                setExibindoMenu(false);
              },
            },
            {
              label: 'Agendas',
              icon: 'pi pi-user',
              disabled: !AuthService.checkRoles('ROLE_LER_AGENDA'),
              command: (): void => {
                navigate('/agendas');
                setExibindoMenu(false);
              },
            },
          ],
        },
      ],
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
              disabled: !AuthService.checkRoles('ROLE_LER_PARCELA_RECEBER'),
              command: (): void => {
                navigate('/parcelas-receber');
              },
            },
            {
              label: 'Contas a Pagar',
              disabled: !AuthService.checkRoles('ROLE_LER_DUPLICATA_PAGAR'),
              command: (): void => {
                navigate('/duplicatasPagar');
              },
            },
            {
              label: 'Movimentação Contas',
              disabled: !AuthService.checkRoles('ROLE_LER_MOVIMENTACAO_CONTA'),
              command: (): void => {
                navigate('/movimentacoesContas');
              },
            },
          ],
        },
        {
          label: 'Atendimento',
          icon: 'pi pi-briefcase',
          items: [
            {
              label: 'Agendamento',
              disabled: !AuthService.checkRoles('ROLE_LER_AGENDAMENTO'),
              command: (): void => {
                navigate('/agendamentoAgenda');
              },
            },
            {
              label: 'Gerencia Agendamento',
              disabled: !AuthService.checkRoles('ROLE_LER_AGENDAMENTO'),
              command: (): void => {
                navigate('/agendamentos');
              },
            },
          ],
        },
        {
          label: 'Estoque',
          icon: 'pi pi-briefcase',
          items: [
            {
              label: 'Entrada',
              disabled: !AuthService.checkRoles('ROLE_LER_ENTRADA'),
              command: (): void => {
                navigate('/entradas');
              },
            },
          ],
        },
      ],
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
              disabled: !AuthService.checkRoles('ROLE_LER_PARCELA_PAGAR'),
              command: (): void => {
                navigate('/relatorios/pagar-rel');
              },
            },
            {
              label: 'Contas a Receber',
              disabled: !AuthService.checkRoles('ROLE_LER_PARCELA_RECEBER'),
              command: (): void => {
                navigate('/relatorios/receber-rel');
              },
            },
          ],
        },
      ],
    },
    {
      label: 'Sair',
      icon: 'pi pi-power-off',
      command: (): void => {
        //
      },
    },
  ];

  return menuReturn;
}