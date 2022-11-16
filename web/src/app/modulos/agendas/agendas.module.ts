import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule} from 'primeng/checkbox';

import { CoreModule } from 'src/app/core/core.module';
import { AgendaPesquisaComponent } from './agenda-pesquisa/agenda-pesquisa.component';
import { AgendaCadastroComponent } from './agenda-cadastro/agenda-cadastro.component';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [
    AgendaCadastroComponent, AgendaPesquisaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    TooltipModule,
    InputTextModule,
    InputMaskModule,
    CalendarModule,
    ButtonModule,
    DropdownModule,
    TableModule,
    SplitButtonModule,
    CoreModule,
    MenuModule,
    CurrencyMaskModule,
    CheckboxModule
  ],
  exports: [
    AgendaCadastroComponent, AgendaPesquisaComponent
  ]
})
export class AgendaModule { }
