import { IRequest, IResponse } from '../../util/tipos';
import UsuarioService from '../services/UsuarioService';

class UsuarioController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const usuarioService: UsuarioService = new UsuarioService(req.connecionDbName);
    const retorno = await usuarioService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const usuarioService: UsuarioService = new UsuarioService(req.connecionDbName);
    const retorno = await usuarioService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const usuarioService: UsuarioService = new UsuarioService(req.connecionDbName);
    const retorno = await usuarioService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }
  async delete(req: IRequest, res: IResponse): Promise<any> {
    const usuarioService: UsuarioService = new UsuarioService(req.connecionDbName);
    await usuarioService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new UsuarioController();
