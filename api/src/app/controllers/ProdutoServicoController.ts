import { IRequest, IResponse } from '../../util/tipos';
import ProdutoServicoService from '../services/ProdutoServicoService';

class ProdutoServicoController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const produtoServicoService: ProdutoServicoService = new ProdutoServicoService(req.connecionDbName);
    const retorno = await produtoServicoService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const produtoServicoService: ProdutoServicoService = new ProdutoServicoService(req.connecionDbName);
    const retorno = await produtoServicoService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const produtoServicoService: ProdutoServicoService = new ProdutoServicoService(req.connecionDbName);
    const retorno = await produtoServicoService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }
  async delete(req: IRequest, res: IResponse): Promise<any> {
    const produtoServicoService: ProdutoServicoService = new ProdutoServicoService(req.connecionDbName);
    await produtoServicoService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new ProdutoServicoController();
