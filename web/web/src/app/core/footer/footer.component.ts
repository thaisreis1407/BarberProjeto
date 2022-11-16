import { UtilService } from 'src/app/shared/util.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private utilService: UtilService
  ) {

  }

  ngOnInit() {

  }
}
