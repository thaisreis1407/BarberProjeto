import { AuthService } from './auth.service';

import { Injectable } from '@angular/core';
import { ConfigService } from './../shared/config.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private authService: AuthService
  ) {

  }

  logout() {
    return this.authService.logout();
  }
}
