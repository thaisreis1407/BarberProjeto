import { IRequest, IResponse } from '../../util/tipos';
import DuplicataPagarService from '../services/DuplicataPagarService';

class DuplicataPagarController {
  async index(req: IRequest, res: IResponse): Promise<any> {
    const duplicataPagarService: DuplicataPagarService = new DuplicataPagarService(req.connecionDbName);
    const retorno = await duplicataPagarService.index(req.params, req.query);
    return res.json(retorno);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const duplicataPagarService: DuplicataPagarService = new DuplicataPagarService(req.connecionDbName);
    const retorno = await duplicataPagarService.store(req.body);

    return res.status(201).json(retorno);
  }

  async update(req: IRequest, res: IResponse): Promise<any> {
    const duplicataPagarService: DuplicataPagarService = new DuplicataPagarService(req.connecionDbName);
    const retorno = await duplicataPagarService.update(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }


  async quitar(req: IRequest, res: IResponse): Promise<any> {
    const duplicataPagarService: DuplicataPagarService = new DuplicataPagarService(req.connecionDbName);
    const retorno = await duplicataPagarService.quitar(Number(req.params.id), req.body);

    return res.status(200).json(retorno);
  }

  async estornar(req: IRequest, res: IResponse): Promise<any> {
    const duplicataPagarService: DuplicataPagarService = new DuplicataPagarService(req.connecionDbName);
    const retorno = await duplicataPagarService.estornar(Number(req.params.id));

    return res.status(200).json(retorno);
  }

  async delete(req: IRequest, res: IResponse): Promise<any> {
    const duplicataPagarService: DuplicataPagarService = new DuplicataPagarService(req.connecionDbName);
    await duplicataPagarService.delete(Number(req.params.id));

    return res.status(204).send();
  }
}

export default new DuplicataPagarController();
