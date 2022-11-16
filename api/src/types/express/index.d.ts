/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  interface Request {
    connecionDbName: string;
    idUsuario?: number;
    size?: number;
    number?: number;
  }
}
