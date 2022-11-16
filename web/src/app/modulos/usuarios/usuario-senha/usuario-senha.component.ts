import { ErrorHandlerService } from './../../../core/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/seguranca/auth.service';
import { UsuarioService } from 'src/app/servicos/usuario.service';
import { MensagemService } from 'src/app/shared/mensagem.service';

@Component({
  selector: 'app-usuario-senha',
  templateUrl: './usuario-senha.component.html',
  styleUrls: ['./usuario-senha.component.css']
})
export class UsuarioSenhaComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,
    private authService: AuthService,
    private msgService: MensagemService,
    private errorHandler: ErrorHandlerService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  alterarSenha(senhaAntiga: string, senhaNova: string, confirmacaoSenha: string ) {
    if (confirmacaoSenha !== senhaNova) {
      this.msgService.erro('Senha diverge da confirmação.');
    } else {
      this.usuarioService.alterarSenha(
        this.authService.usuarioLogado(), senhaNova, senhaAntiga)
        .then(() => {
          this.msgService.sucesso('Alteração realizada.');
          this.router.navigate(['/home']);
        }).catch(error => this.errorHandler.handle(error));
    }
  }
}
