import { IRequest, IResponse } from '../../util/tipos';
import AtendenteService from '../services/AtendenteService';

class AtendenteController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const atendenteService: AtendenteService = new AtendenteService(req.connecionDbName);
    const retorno = await atendenteService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const atendenteService: AtendenteService = new AtendenteService(req.connecionDbName);
    const retorno = await atendenteService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const atendenteService: AtendenteService = new AtendenteService(req.connecionDbName);
    const retorno = await atendenteService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }
  async delete(req: IRequest, res: IResponse): Promise<any> {
    const atendenteService: AtendenteService = new AtendenteService(req.connecionDbName);
    await atendenteService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new AtendenteController();
