import { Agendamento } from './../core/model';
import { UtilService } from 'src/app/shared/util.service';
// tslint:disable-next-line: max-line-length
import { AgendamentoCadastroDialogComponent } from './../modulos/agendamento/agendamento-cadastro-dialog/agendamento-cadastro-dialog.component';
import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/components/common/api';

@Injectable({
  providedIn: 'root'
})

export class AgendamentoCadastroDialogService {

  constructor(
    public dialogService: DialogService,
    public utilService: UtilService) {}

  abreCadastro(agendamento: Agendamento,  retorno: (salvou: boolean) => void) {
      const ref = this.dialogService.open(AgendamentoCadastroDialogComponent, {
          header: 'Agendamento',
          width: this.utilService.telaMobile() ? '94%' : '70%',
          height: '400px',
          contentStyle: {'max-height': '400px', 'overflow': 'auto' },
          data: {agendamento}
      });

      ref.onClose.subscribe((salvou: boolean) => {
        retorno(salvou);
      });
  }

}
