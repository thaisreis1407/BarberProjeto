import { IRequest, IResponse } from '../../util/tipos';
import MovimentacaoContaService from '../services/MovimentacaoContaService';

class MovimentacaoContaController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const movimentacaoContaService: MovimentacaoContaService = new MovimentacaoContaService(
      req.connecionDbName
    );
    const retorno = await movimentacaoContaService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const movimentacaoContaService: MovimentacaoContaService = new MovimentacaoContaService(
      req.connecionDbName
    );
    const retorno = await movimentacaoContaService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const movimentacaoContaService: MovimentacaoContaService = new MovimentacaoContaService(
      req.connecionDbName
    );
    const retorno = await movimentacaoContaService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }
  async delete(req: IRequest, res: IResponse): Promise<any> {
    const movimentacaoContaService: MovimentacaoContaService = new MovimentacaoContaService(
      req.connecionDbName
    );
    await movimentacaoContaService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new MovimentacaoContaController();
