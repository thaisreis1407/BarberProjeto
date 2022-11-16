import { IRequest, IResponse } from '../../util/tipos';
import ClienteService from '../services/ClienteService';

class ClienteController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const clienteService: ClienteService = new ClienteService(req.connecionDbName);
    const retorno = await clienteService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const clienteService: ClienteService = new ClienteService(req.connecionDbName);
    const retorno = await clienteService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const clienteService: ClienteService = new ClienteService(req.connecionDbName);
    const retorno = await clienteService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }
  async delete(req: IRequest, res: IResponse): Promise<any> {
    const clienteService: ClienteService = new ClienteService(req.connecionDbName);
    await clienteService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new ClienteController();
