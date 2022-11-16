import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'Barber';

  constructor() {
    // Configura o Date para retornar o Json considerando o Timezone
    // Date.prototype.toJSON = function() {
    //   const hoursDiff = this.getHours() - this.getTimezoneOffset() / 60;
    //   this.setHours(hoursDiff);
    //   return this.toISOString();
    // };
  }

  ngOnInit() {

  }

}
