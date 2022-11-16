import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export type IResponse = Response;

export type INextFunction = NextFunction;

export type IErrorRequestHandler = ErrorRequestHandler;

export type IRequest = Request;

export interface IPageable {
  totalPages: number;
  page: number;
  size: number;
  totalElements: number;
  content: any[];
}
