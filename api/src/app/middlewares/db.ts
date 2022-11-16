import { NextFunction } from 'express';

import configDb from '../../config/database';
import { IRequest, IResponse } from '../../util/tipos';

export default (req: IRequest, _res: IResponse, next: NextFunction): void => {
  req.connecionDbName = configDb.connectionName;
  return next();
};
