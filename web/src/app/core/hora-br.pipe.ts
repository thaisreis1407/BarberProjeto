import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

import * as moment from 'moment';

@Pipe({
  name: 'horaBr'
})

export class HoraBrPipe implements PipeTransform {

  transform(value: any, mostraSegundo: boolean = false): any {
    return this.horaBr(value, mostraSegundo);
  }

  horaBr(value: any, mostraSegundo: boolean): string {
    if (value instanceof Date) {
      return this.formataData(value, mostraSegundo);
    } else {
      const m = moment(value, 'hh:mm');
      if (m.isValid()) {
        return this.formataData(m.toDate(), mostraSegundo);
      }
    }
  }

  formataData(value: Date, mostraSegundo: boolean) {
    if (mostraSegundo) {
      return formatDate(value, 'HH:mm:ss', 'pt-BR');
    } else {
      return formatDate(value, 'HH:mm', 'pt-BR');
    }
  }
}
