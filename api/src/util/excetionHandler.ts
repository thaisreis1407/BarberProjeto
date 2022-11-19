import express from 'express';

import { CodError } from './constants';
import { IRequest, IResponse, IErrorRequestHandler, INextFunction } from './tipos';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */

export function processError(err: any): any[] {
  let httpCode = 500;
  let objErro = err;
  console.log(err.name);
  if (err.name) {
    if (err.name === 'SequelizeConnectionError') {
      httpCode = 500;
      objErro = {
        mensagemDesenvolvedor: 'Falha de conexão aos dados',
        detalhe: err,
        mensagemUsuario: 'Falha de conexão aos dados',
      };
    } else if (err.name === 'AcessDeniedException') {
      httpCode = 401;
      objErro = {
        mensagemDesenvolvedor: 'Acesso negado',
        detalhe: err.error,
        mensagemUsuario: err.error,
      };
    } else if (err.name === 'NotFoundError') {
      httpCode = 404;
      objErro = {
        mensagemDesenvolvedor: 'Recurso não encontrado',
        detalhe: err.errors,
        mensagemUsuario: err.errors[0],
      };
    } else if (err.name === 'ValidationError') {
      httpCode = 400;
      objErro = {
        mensagemDesenvolvedor: 'Falha de validação',
        detalhe: err.errors,
        mensagemUsuario: err.errors[0],
      };
    } else if (err.name === 'ValidacaoException') {
      httpCode = 400;
      objErro = {
        mensagemDesenvolvedor: 'Falha de validação',
        detalhe: [err.message],
        mensagemUsuario: err.errors[0],
      };
    } else if (err.name === 'AuthenticationException') {
      httpCode = 401;
      objErro = {
        mensagemDesenvolvedor: 'Falha de validação',
        detalhe: [err.message],
        mensagemUsuario: err.errors[0],
      };
    } else if (err.name === 'AuthorizedError') {
      httpCode = 403;
      objErro = {
        mensagemDesenvolvedor: 'Falha de autorização',
        detalhe: err.errors,
        mensagemUsuario: err.errors[0],
      };
      // typeorm
    } else if (err.name === 'QueryFailedError') {
      const codeError: string = err.code || '';
      let mensagemDetalhe = '';
      let mensagemUsuario = 'Falha de validação';
      mensagemDetalhe = err.detail || err.message || 'Falha de validação';
      if (codeError === '23502') {
        mensagemUsuario = `Campo ${err.column} deve ser informado`;
      } else if (codeError === '22001') {
        mensagemUsuario = `Valor ultrapassou tamanho máximo`;
      } else if (codeError === '22008') {
        mensagemUsuario = `Data/Hora inválida`;
      } else {
        httpCode = 500;
        mensagemUsuario = 'Falha na solicitação';
      }
      objErro = {
        mensagemDesenvolvedor: mensagemUsuario,
        detalhe: [mensagemDetalhe],
        mensagemUsuario,
      };

      httpCode = 400;
    } else if (err.name === 'SequelizeValidationError') {
      if (err.errors) {
        const listaErrosValidacao = err.errors.map((e: any) => {
          if (e.type === 'notNull Violation') return `Campo ${e.path} é obrigatório`;
          if (e.type === 'Validation error') {
            if (e.validatorKey === 'isDate') return `Campo "${e.path}" não é uma data válida`;
            if (e.validatorKey === 'isTime') return `Campo "${e.path}" não é uma hora válida`;
            if (e.validatorKey === 'isInt') return `Campo "${e.path}" não é um inteiro válido`;
            if (e.validatorKey === 'isEmail')
              return `Campo "${e.path}" não é um e-mail válido`;
            if (['isFloat', 'isDecimal', 'isNumeric'].includes(e.validatorKey))
              return `Campo "${e.path}" não número válido`;
            if (e.validatorKey === 'notEmpty') {
              return `Campo "${e.path}" deve ser informado`;
            }
          }

          return e.message;
        });
        objErro = {
          mensagemDesenvolvedor: 'Falha de validação',
          detalhe: listaErrosValidacao,
          mensagemUsuario: listaErrosValidacao[0],
        };
      } else {
        objErro = {
          mensagemDesenvolvedor: 'Falha de validação',
          mensagemUsuario: 'Falha na validação dos dados',
          detalhe: err.errors,
        };
      }
      httpCode = 400;
    } else if (
      err.name === 'SequelizeForeignKeyConstraintError' ||
      err.name === 'SequelizeUniqueConstraintError' ||
      err.name === 'SequelizeExclusionConstraintError'
    ) {
      objErro = {
        mensagemDesenvolvedor: 'Erro de integridade no banco de dados',
        mensagemUsuario: 'Operação não permitida, falha de integridade',
        detalhe: err.parent,
      };
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Log de Erros:', err);
  }
  return [objErro, httpCode];
}

export default function exceptionHandler(server: express.Express): void {
  server.use(
    (err: IErrorRequestHandler, _req: IRequest, res: IResponse, _next: INextFunction) => {
      // console.log(err);
      const [objErro, httpCode] = processError(err);
      if (typeof objErro === 'object' && JSON.stringify(objErro) !== '{}') {
        if (!Array.isArray(objErro.detalhe)) {
          objErro.detalhe = [objErro.detalhe];
        }
        return res.status(httpCode).json(objErro);
      }

      return res.status(httpCode).json({
        mensagemDesenvolvedor: 'Erro inesperado',
        mensagemUsuario: 'Erro inesperado',
        detalhe: objErro.toString(),
        codInternoError: CodError.NORMAL,
      });
    }
  );
}
