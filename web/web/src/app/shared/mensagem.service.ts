import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';


@Injectable({
  providedIn: 'root'
})
export class MensagemService {

  constructor(private messageService: MessageService) {}

    sucesso(mensagem) {
      this.messageService.add({ severity: 'success', summary: '', detail: mensagem});
    }

    info(mensagem) {
      this.messageService.add({severity: 'info', summary: '', detail: mensagem});
    }
    erro(mensagem) {
      this.messageService.add({ severity: 'error', summary: '', detail: mensagem});
    }
}
