/* eslint-disable no-restricted-syntax */
import { addMinutes, differenceInMinutes, getDay } from 'date-fns';
import { Repository, Between } from 'typeorm';

/* eslint-disable no-param-reassign */

import { formatDateTime, strToDate } from '../../util/functions';
import NotFoundException from '../exceptions/NotFoundException';
import ValidationException from '../exceptions/ValidationException';
// import ValidationException from '../exceptions/ValidationException';
import { AgendamentoModel } from '../models/AgendamentoModel';
import { AgendaModel } from '../models/AgendaModel';
import { AtendimentoModel } from '../models/AtendimentoModel';
import AgendaDia from '../models/dto/AgendaDia';
import AgendaDiaDetalhe from '../models/dto/AgendaDiaDetalhe';
import { MovimentacaoContaModel } from '../models/MovimentacaoContaModel';
import { ViewAgendamentoModel } from '../models/views/ViewAgendamentoModel';
import BaseService from './BaseService';
import MovimentacaoContaService from './MovimentacaoContaService';
import ProdutoServicoService from './ProdutoServicoService';

interface IFiltroAgendamento {
  id?: number;
  status?: any;
  idAtendente?: any;
  idCliente?: any;
  data?: any;
}

class AgendamentoService extends BaseService<AgendamentoModel> {
  repositoryAgenda: Repository<AgendaModel>;
  repositoryViewAgendamento: Repository<ViewAgendamentoModel>;
  repositoryAtendimento: Repository<AtendimentoModel>;
  nomeConexao: string;
  constructor(nomeConexao = '') {
    super(nomeConexao, AgendamentoModel);
    this.nomeConexao = nomeConexao;
    this.repositoryAgenda = this.connection.getRepository(AgendaModel);
    this.repositoryViewAgendamento = this.connection.getRepository(ViewAgendamentoModel);
    this.repositoryAtendimento = this.connection.getRepository(AtendimentoModel);
  }

  // override
  public carregaConexao(nomeConexao: string): void {
    super.carregaConexao(nomeConexao);
  }

  async index(reqParams: any, queryParams: any): Promise<any> {
    if (reqParams.id) {
      const where = {
        id: reqParams.id,
      };

      const agendamento = await this.repository.findOne(where, {});
      if (agendamento) {
        return agendamento;
      }

      throw new NotFoundException();
    }

    const agendamentos = await this.findAllPageable<ViewAgendamentoModel>(
      this.repositoryViewAgendamento,
      queryParams,
      {
        order: { id: 'ASC' },
      }
    );

    return agendamentos;
  }

  async indexAgendaDia(data: Date | null): Promise<any> {
    if (!data) {
      return null;
    }

    const diaSemana = getDay(data);

    const retorno = new Array<AgendaDia>();

    const agendas = await this.repositoryAgenda.find({
      relations: ['agendaDetalhe'],
    });

    for (const agenda of agendas) {
      const agendaDiaDetalhes = this.criaAgendaDiaDetalhe(agenda, diaSemana);

      if (agendaDiaDetalhes && agendaDiaDetalhes.length > 0) {
        const agendaDia = new AgendaDia();
        agendaDia.idAgenda = agenda.id;
        agendaDia.nomeAgenda = agenda.nome;

        if (agenda.atendente) {
          agendaDia.idAtendente = agenda.atendente.id;
        }
        agendaDia.agendaDiaDetalhe = agendaDiaDetalhes;

        retorno.push(agendaDia);
      }
    }

    // for (const agenda of agendas) {
    //   if (agenda.agendaDetalhe) {
    //     let agendaDia = null;
    //     let diaSemanaAtual;
    //     for (const agendaDetalhe of agenda.agendaDetalhe) {
    //       if (
    //         agendaDetalhe.diaSemana === diaSemana &&
    //         diaSemanaAtual !== agendaDetalhe.diaSemana &&
    //         (agendaDia === null || agendaDia.idAgenda === agenda.id)
    //       ) {
    //         agendaDia = new AgendaDia();
    //         agendaDia.idAgenda = agenda.id;
    //         agendaDia.nomeAgenda = agenda.nome;
    //         if (agenda.atendente) {
    //           agendaDia.idAtendente = agenda.atendente.id;
    //         }
    //         const agendaDiaDetalhes = this.criaAgendaDiaDetalhe(agenda, diaSemana);
    //         agendaDia.agendaDiaDetalhe = agendaDiaDetalhes;
    //         retorno.push(agendaDia);
    //       }
    //       diaSemanaAtual = agendaDetalhe.diaSemana;
    //     }
    //   }
    // }

    // popula atendimento na lista de agendaDia
    for (const agendaDia of retorno) {
      const listaAgendamento = await this.repositoryViewAgendamento.find({
        where: {
          idAgenda: agendaDia.idAgenda,
          data,
        },
      });

      await this.vinculaAgendimentosAgenda(agendaDia, listaAgendamento);
    }

    return retorno;
  }

  criaAgendaDiaDetalhe(agenda: AgendaModel, diaSemana: number): AgendaDiaDetalhe[] {
    if (!agenda.agendaDetalhe) {
      return [];
    }
    let retorno = new Array<AgendaDiaDetalhe>();

    for (const agendaDetalhe of agenda.agendaDetalhe) {
      if (diaSemana === agendaDetalhe.diaSemana) {
        const horarioInicio = strToDate(
          `2021-01-01 ${agendaDetalhe.horarioInicio}`,
          'yyyy-MM-dd HH:mm:ss'
        );
        const horarioFim = strToDate(
          `2021-01-01 ${agendaDetalhe.horarioFim}`,
          'yyyy-MM-dd HH:mm:ss'
        );

        const minutos =
          horarioInicio && horarioFim ? differenceInMinutes(horarioFim, horarioInicio) : 0;

        const qtdIntervalo = Math.trunc(minutos / agenda.intervaloMinutos);

        let horarioInicial =
          strToDate(`2021-01-01 ${agendaDetalhe.horarioInicio}`, 'yyyy-MM-dd HH:mm:ss') ||
          new Date();

        for (let i = 0; i < qtdIntervalo; i++) {
          const agendaDiaDetalhe = new AgendaDiaDetalhe();
          agendaDiaDetalhe.hora = formatDateTime(horarioInicial, 'HH:mm');
          retorno.push(agendaDiaDetalhe);

          horarioInicial = addMinutes(horarioInicial, agenda.intervaloMinutos);
        }
      }
    }

    retorno = retorno.sort((e1, e2) => {
      const hora1 = e1.hora || '';
      const hora2 = e2.hora || '';

      if (hora1 < hora2) {
        return -1;
      }
      if (hora1 > hora2) {
        return 1;
      }
      return 0;
    });
    return retorno;
  }

  async vinculaAgendimentosAgenda(
    agendaDia: AgendaDia,
    listaAgendamento: ViewAgendamentoModel[]
  ): Promise<void> {
    if (!listaAgendamento || !agendaDia || !agendaDia.agendaDiaDetalhe) {
      return;
    }

    let adicionouRegistroNovo = false;

    for (const agendamento of listaAgendamento) {
      let encontrou = false;

      const agendaHora = strToDate(`2021-01-01 ${agendamento.hora}`, 'yyyy-MM-dd HH:mm:ss');
      const horaAgendamento = formatDateTime(agendaHora, 'HH:mm');

      for (const agendaDiaDetalhe of agendaDia.agendaDiaDetalhe) {
        const horaAgenda = agendaDiaDetalhe.hora;
        if (horaAgenda === horaAgendamento) {
          agendaDiaDetalhe.agendamento = agendamento;
          encontrou = true;
          adicionouRegistroNovo = true;
          break;
        }
      }
      if (!encontrou) {
        const agendaDiaDetalheNovo = new AgendaDiaDetalhe();
        try {
          agendaDiaDetalheNovo.hora = horaAgendamento;
        } catch (err) {
          //
        }
        agendaDiaDetalheNovo.agendamento = agendamento;
        agendaDia.agendaDiaDetalhe.push(agendaDiaDetalheNovo);
      }
    }

    if (adicionouRegistroNovo) {
      // se adicionou novo registro, então devemos organizar a lista
      // Comparator<AgendaDiaDetalhe> compareByHora = (AgendaDiaDetalhe o1, AgendaDiaDetalhe o2) -> o1.getHora().compareTo( o2.getHora());
      const listaAgendaDia = agendaDia.agendaDiaDetalhe.sort((e1, e2) => {
        const hora1 = e1.hora || '';
        const hora2 = e2.hora || '';

        if (hora1 < hora2) {
          return -1;
        }
        if (hora1 > hora2) {
          return 1;
        }
        return 0;
      });
      agendaDia.agendaDiaDetalhe = listaAgendaDia;
    }
  }

  async store(reqBody: AgendamentoModel): Promise<any> {
    const agendamento = this.repository.create(reqBody);

    return this.repository.save(agendamento);
  }

  async update(id: number, reqBody: AgendamentoModel): Promise<any> {
    const agendamentoExist = await this.repository.findOne(id || 0);
    if (!agendamentoExist) {
      throw new NotFoundException('Agendamento não existe');
    }

    const agendamento = this.repository.create(reqBody);

    agendamento.id = id;
    // await this.connection.transaction(async () => {

    if (
      agendamentoExist.atendimento &&
      agendamentoExist.atendimento.atendimentoDetalhe &&
      agendamentoExist.atendimento.atendimentoDetalhe.length > 0
    ) {
      const produtos = agendamentoExist.atendimento.atendimentoDetalhe;

      for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].tipoProdutoServico === 0) {
          await this.atualizaEstoque(produtos[i].idProdutoServico, produtos[i].quantidade);
        }
      }
    }

    if (
      reqBody.atendimento &&
      reqBody.atendimento.atendimentoDetalhe &&
      reqBody.atendimento.atendimentoDetalhe.length > 0
    ) {
      const produtos = reqBody.atendimento.atendimentoDetalhe;

      for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].tipoProdutoServico === 0) {
          await this.atualizaEstoque(
            produtos[i].idProdutoServico,
            -1 * produtos[i].quantidade
          );
        }
      }
    }

    if (reqBody.atendimento && reqBody.atendimento.formaPagamento) {
      const movimentacaoContaService = new MovimentacaoContaService(this.nomeConexao);
      const movimentacaoContaRepository =
        this.connection.getRepository(MovimentacaoContaModel);
      if (agendamentoExist.status !== reqBody.status) {
        if (reqBody.status === 'F') {
          const movimentacaoConta = new MovimentacaoContaModel();
          movimentacaoConta.idConta = reqBody.atendimento.formaPagamento.idConta;
          movimentacaoConta.idAtendimento = reqBody.atendimento.id;
          movimentacaoConta.descricao = `Faturamento do atendimento Id: ${id}`;
          movimentacaoConta.tipo = 'C';
          movimentacaoConta.valor = reqBody.atendimento.valorTotal;
          movimentacaoConta.dataMovimentacao = new Date(); // reqBody.atendimento.dataFim;
          movimentacaoConta.conta = reqBody.atendimento.formaPagamento.conta;
          await movimentacaoContaService.store(movimentacaoConta);
        } else if (agendamentoExist.status === 'F') {
          const movimentacoesConta = await movimentacaoContaRepository.find({
            idAtendimento: reqBody.atendimento?.id,
          });

          if (movimentacoesConta && movimentacoesConta.length > 0) {
            for (let i = 0; i < movimentacoesConta.length; i++) {
              await movimentacaoContaService.delete(movimentacoesConta[i].id);
            }
          }
        }
      }
    }
    return this.repository.save(agendamento);
    // });
  }

  async abrirAtendimento(id: number): Promise<void> {
    const agendamentoExist = await this.repository.findOne(id || 0);
    if (!agendamentoExist) {
      throw new NotFoundException('Agendamento não existe');
    }

    if (agendamentoExist.status === 'E' || agendamentoExist.atendimento) {
      throw new ValidationException('Já existe um atendimento aberto');
    }

    const atendimento = new AtendimentoModel();
    agendamentoExist.status = 'E';
    atendimento.dataInicio = new Date();
    atendimento.horaInicio = new Date();
    atendimento.idAgendamento = id;
    atendimento.valorTotal = 0;
    atendimento.obs = '';

    await this.connection.transaction(async (tmanager) => {
      await tmanager.save(agendamentoExist);
      await tmanager.save(atendimento);
    });

    // await this.repository.save(agendamentoExist);
    // await this.repositoryAtendimento.save(atendimento);
  }

  async excluirAtendimento(id: number): Promise<void> {
    const agendamentoExist = await this.repository.findOne(id || 0);
    if (!agendamentoExist) {
      throw new NotFoundException('Agendamento não existe');
    }

    if (agendamentoExist.status === 'A' || !agendamentoExist.atendimento) {
      throw new ValidationException('Não existe atendimento em aberto');
    }

    if (agendamentoExist.status === 'F') {
      throw new ValidationException('Não pode excluir atendimento Faturado');
    }

    agendamentoExist.status = 'A';

    await this.connection.transaction(async (tmanager) => {
      await tmanager.save(agendamentoExist);
      if (agendamentoExist.atendimento) {
        if (agendamentoExist.atendimento.atendimentoDetalhe) {
          const produtos = agendamentoExist.atendimento.atendimentoDetalhe;

          for (let i = 0; i < produtos.length; i++) {
            if (produtos[i].tipoProdutoServico === 0) {
              await this.atualizaEstoque(produtos[i].idProdutoServico, produtos[i].quantidade);
            }
          }
        }

        await tmanager.getRepository(AtendimentoModel).delete(agendamentoExist.atendimento.id);
      }
    });
    // await this.repository.save(agendamentoExist);
    // await this.repositoryAtendimento.delete(agendamentoExist.atendimento.id);
  }

  async delete(id: number): Promise<any> {
    const atendenteExist = await this.repository.findOne(id || 0);
    if (!atendenteExist) {
      throw new NotFoundException('Agendamento não existe');
    }
    if (atendenteExist.atendimento) {
      throw new NotFoundException(
        'Agendamento tem um atendimento vinculado. Exclua o atendimento primeiro.'
      );
    }
    await this.repository.delete(id);
  }

  async atualizaEstoque(idProduto: number, quantAjustar: number): Promise<void> {
    const produtoService = new ProdutoServicoService(this.nomeConexao);
    await produtoService.atualizaEstoque(idProduto, quantAjustar);
  }

  // override
  montaFiltro(queryParams: any): IFiltroAgendamento {
    const retorno: IFiltroAgendamento = {};

    if (queryParams) {
      if (queryParams.id) {
        retorno.id = queryParams.id;
      }

      if (queryParams.idCliente) {
        retorno.idCliente = queryParams.idCliente;
      }

      if (queryParams.idAtendente) {
        retorno.idAtendente = queryParams.idAtendente;
      }

      if (queryParams.status) {
        retorno.status = queryParams.status;
      }

      if (queryParams.dataInicio && queryParams.dataFim) {
        retorno.data = Between(queryParams.dataInicio, queryParams.dataFim);
      }
    }

    return retorno;
  }
}

export default AgendamentoService;
