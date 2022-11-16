import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AgendamentoCadastroDialogComponent } from './agendamento-cadastro-dialog/agendamento-cadastro-dialog.component';
import { AgendamentoAgendaComponent } from './agendamento-agenda/agendamento-agenda.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';

import { CoreModule } from 'src/app/core/core.module';
import { AgendamentoPesquisaComponent } from './agendamento-pesquisa/agendamento-pesquisa.component';
import { AgendamentoCadastroComponent } from './agendamento-cadastro/agendamento-cadastro.component';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    AgendamentoCadastroComponent,
    AgendamentoPesquisaComponent,
    AgendamentoAgendaComponent,
    AgendamentoCadastroDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    TooltipModule,
    InputTextModule,
    InputMaskModule,
    InputTextareaModule,
    CalendarModule,
    ButtonModule,
    DropdownModule,
    TableModule,
    SplitButtonModule,
    CoreModule,
    MenuModule,
    CurrencyMaskModule
  ],
  exports: [
    AgendamentoCadastroComponent,
    AgendamentoPesquisaComponent,
    AgendamentoAgendaComponent,
    AgendamentoCadastroDialogComponent
  ]
})
export class AgendamentosModule { }
