import { IRequest, IResponse } from '../../util/tipos';
import ContaService from '../services/ContaService';

class ContaController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const contaService: ContaService = new ContaService(req.connecionDbName);
    const retorno = await contaService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const contaService: ContaService = new ContaService(req.connecionDbName);
    const retorno = await contaService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const contaService: ContaService = new ContaService(req.connecionDbName);
    const retorno = await contaService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }

  async delete(req: IRequest, res: IResponse): Promise<any> {
    const contaService: ContaService = new ContaService(req.connecionDbName);
    await contaService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new ContaController();
