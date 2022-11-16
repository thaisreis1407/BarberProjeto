import { IRequest, IResponse } from '../../util/tipos';
import FornecedorService from '../services/FornecedorService';

class FornecedorController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const fornecedorService: FornecedorService = new FornecedorService(req.connecionDbName);
    const retorno = await fornecedorService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const fornecedorService: FornecedorService = new FornecedorService(req.connecionDbName);
    const retorno = await fornecedorService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const fornecedorService: FornecedorService = new FornecedorService(req.connecionDbName);
    const retorno = await fornecedorService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }
  async delete(req: IRequest, res: IResponse): Promise<any> {
    const fornecedorService: FornecedorService = new FornecedorService(req.connecionDbName);
    await fornecedorService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new FornecedorController();
