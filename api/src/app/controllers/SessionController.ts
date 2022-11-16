import { IRequest, IResponse } from '../../util/tipos';
import SessionService from '../services/SessionService';

class SessionController {
  reqBody: any;

  constructor() {
    this.reqBody = {};
  }

  async revok(_req: IRequest, res: IResponse): Promise<any> {
    res.cookie('refreshToken', '', { maxAge: 0, httpOnly: true });
    return res.json(null);
  }

  async store(req: IRequest, res: IResponse): Promise<any> {
    const sessionService: SessionService = new SessionService(req.connecionDbName);

    this.reqBody = req.body;

    // compatibilidade com o angular
    if (JSON.stringify(this.reqBody) === '{}') {
      this.reqBody = req.query;
    }

    const [token, refreshToken] = await sessionService.login(this.reqBody, req.cookies);
    res.cookie('refreshToken', refreshToken, { maxAge: 2592000, httpOnly: true });
    return res.json(token);
  }
}

export default new SessionController();
