import { isDate, strToDate } from '../../util/functions';
import { IRequest, IResponse } from '../../util/tipos';
import AgendamentoService from '../services/AgendamentoService';

class AgendamentoController {
  async index(req: any, res: IResponse): Promise<any> {
    const agendamentoService: AgendamentoService = new AgendamentoService(req.connecionDbName);
    if (req.query.data && isDate(req.query.data)) {
      const retorno = await agendamentoService.indexAgendaDia(strToDate(req.query.data));
      return res.json(retorno);
    }
    const retorno = await agendamentoService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const agendamentoService: AgendamentoService = new AgendamentoService(req.connecionDbName);
    const retorno = await agendamentoService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const agendamentoService: AgendamentoService = new AgendamentoService(req.connecionDbName);
    const retorno = await agendamentoService.update(Number(req.params.id), req.body);
    return res.json(retorno);
  }

  async abrirAtendimento(req: IRequest, res: IResponse): Promise<any> {
    const agendamentoService: AgendamentoService = new AgendamentoService(req.connecionDbName);
    await agendamentoService.abrirAtendimento(Number(req.params.id));
    return res.status(204).send();
  }

  async excluirAtendimento(req: IRequest, res: IResponse): Promise<any> {
    const agendamentoService: AgendamentoService = new AgendamentoService(req.connecionDbName);
    await agendamentoService.excluirAtendimento(Number(req.params.id));
    return res.status(204).send();
  }

  async delete(req: IRequest, res: IResponse): Promise<any> {
    const atendenteService: AgendamentoService = new AgendamentoService(req.connecionDbName);
    await atendenteService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new AgendamentoController();
