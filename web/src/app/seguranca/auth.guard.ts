import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { UtilService } from 'src/app/shared/util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
    private router: Router,
    private utilService: UtilService
    ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAccessTokenInvalido()) {
      return this.authService.obterNovoAccessToken()
        .then(() => {
          if (this.authService.isAccessTokenInvalido()) {
            // console.log('tentou obter mas nao deu');
            // this.router.navigate(['/login']);
            this.utilService.navegar('/login');
            return false;
          }
          // segue com a rota normal
          this.router.navigate(['/' + next.routeConfig.path]);
        }).catch(() => {
          if (this.authService.isAccessTokenInvalido()) {
            // this.router.navigate(['/login']);
            this.utilService.navegar('/login');

            console.log('erro ao obter token');
            return false;
          }
        });
    }

    if (next.data.roles && !this.authService.temQualquerPermissao(next.data.roles)) {
      this.router.navigate(['/nao-autorizado']);
      return false;
    }
    return true;
  }
}
