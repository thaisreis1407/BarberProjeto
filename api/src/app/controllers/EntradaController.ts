import { IRequest, IResponse } from '../../util/tipos';
import EntradaService from '../services/EntradaService';

class EntradaController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const entradaService: EntradaService = new EntradaService(req.connecionDbName);
    const retorno = await entradaService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const entradaService: EntradaService = new EntradaService(req.connecionDbName);
    const retorno = await entradaService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const entradaService: EntradaService = new EntradaService(req.connecionDbName);
    const retorno = await entradaService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }
  async delete(req: IRequest, res: IResponse): Promise<any> {
    const entradaService: EntradaService = new EntradaService(req.connecionDbName);
    await entradaService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new EntradaController();
