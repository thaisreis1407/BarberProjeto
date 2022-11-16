import jwt from 'jsonwebtoken';

// import { promisify } from 'util';

import authConfig from '../../config/auth';
import { IResponse, INextFunction, IRequest } from '../../util/tipos';
import AuthorizedException from '../exceptions/AuthorizedException';

export default (req: IRequest, _res: IResponse, next: INextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AuthorizedException('Token not provided.');
  }

  const [, access_token] = authHeader.split(' ');
  try {
    const decoded: any = jwt.verify(access_token, authConfig.secret);

    const { usuario } = decoded;
    req.idUsuario = usuario.id;
    if (req.query) {
      if (!req.query.size) {
        req.query.size = '100';
      }
      if (!req.query.number) {
        req.query.number = '0';
      }
    }
    return next();
  } catch (err) {
    throw new AuthorizedException('Token invalit.');
  }
};
