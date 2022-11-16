import { IRequest, IResponse } from '../../util/tipos';
import AgendaService from '../services/AgendaService';

class AgendaController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const usuarioService: AgendaService = new AgendaService(req.connecionDbName);
    const retorno = await usuarioService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const usuarioService: AgendaService = new AgendaService(req.connecionDbName);
    const retorno = await usuarioService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const usuarioService: AgendaService = new AgendaService(req.connecionDbName);
    const retorno = await usuarioService.update(Number(req.params.id), req.body);
    return res.json(retorno);
  }

  async delete(req: IRequest, res: IResponse): Promise<any> {
    const agendaService: AgendaService = new AgendaService(req.connecionDbName);
    await agendaService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new AgendaController();
