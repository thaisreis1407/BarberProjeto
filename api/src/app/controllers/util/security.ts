import { NextFunction, Request, Response } from 'express';
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';

import authConfig from '../../../config/auth';
import { geraObjError } from '../../../util/functions';

export default function auth(roles: any[] | string): any {
  let arrayRoles: any[] = [];
  if (typeof roles === 'string') {
    arrayRoles = [roles];
  }

  const funcRet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any> => {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');
    // const decoded = await promisify(jwt.verify)(token, authConfig.secret || '');
    const decoded: any = jwt.verify(token, authConfig.secret || '');

    const userRoles = decoded.authorities || '';

    if (arrayRoles.length) {
      let findRole = false;
      arrayRoles.forEach((r) => {
        if (userRoles.includes(r)) {
          findRole = true;
        }
        return true;
      });

      if (!findRole) {
        return res.status(403).json(geraObjError('Você não tem permissão para esta ação.'));
      }
    }

    next();
  };
  return [funcRet];
}
