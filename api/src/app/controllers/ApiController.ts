import { versionInfo } from '../../util/functions';
import { IResponse, IRequest } from '../../util/tipos';

class ApiController {
  async index(_req: IRequest, res: IResponse): Promise<any> {
    return res.json(versionInfo());
  }
}

export default new ApiController();
