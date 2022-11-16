import { AuthService } from 'src/app/seguranca/auth.service';
import { MensagemService } from './../shared/mensagem.service';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { NotAuthenticatedError } from '../seguranca/custom-http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private mensagemService: MensagemService,
    private auth: AuthService) { }

  handle(errorResponse: any) {
    // this.auth.mostrarStatus = false;
    let msg: string;
    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse instanceof HttpErrorResponse
      && errorResponse.status >= 400 && errorResponse.status <= 499) {
      let errors;
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.status === 403) {
        msg = 'Você não ter permissão para executar esta ação.';
      }

      try {
        errors = errorResponse.error;
        msg = 'Não foi possível processar a solicitação: ' + errors.mensagemUsuario;
      } catch (e) { }

      console.error('Ocorreu um erro', errorResponse);
    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'É necessário logar novamente';
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }

    this.mensagemService.erro(msg);
  }
}
