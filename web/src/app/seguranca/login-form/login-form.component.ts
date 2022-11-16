import { UtilService } from 'src/app/shared/util.service';
import { Component, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private authService: AuthService,
    private errorHandlerService: ErrorHandlerService,
    private utilService: UtilService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(usuario: string, senha: string) {
    this.authService.login(usuario.toUpperCase(), senha)
      .then(() => {
        this.utilService.navegar('/home');
        // this.router.navigate(['/home']);
      })
      .catch( erro => {
        this.errorHandlerService.handle(erro);
      });
  }

}
