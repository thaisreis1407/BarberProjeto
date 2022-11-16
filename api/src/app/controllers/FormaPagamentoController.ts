import { IRequest, IResponse } from '../../util/tipos';
import FormaPagamentoService from '../services/FormaPagamentoService';

class FormaPagamentoController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const formaPagamentoService: FormaPagamentoService = new FormaPagamentoService(req.connecionDbName);
    const retorno = await formaPagamentoService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const formaPagamentoService: FormaPagamentoService = new FormaPagamentoService(req.connecionDbName);
    const retorno = await formaPagamentoService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const formaPagamentoService: FormaPagamentoService = new FormaPagamentoService(req.connecionDbName);
    const retorno = await formaPagamentoService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }
  async delete(req: IRequest, res: IResponse): Promise<any> {
    const formaPagamentoService: FormaPagamentoService = new FormaPagamentoService(req.connecionDbName);
    await formaPagamentoService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new FormaPagamentoController();
