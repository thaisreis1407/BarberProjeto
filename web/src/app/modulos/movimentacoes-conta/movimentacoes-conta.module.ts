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
import { MovimentacaoContaPesquisaComponent } from './movimentacao-conta-pesquisa/movimentacao-conta-pesquisa.component';
import { MovimentacaoContaCadastroComponent } from './movimentacao-conta-cadastro/movimentacao-conta-cadastro.component';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [
    MovimentacaoContaCadastroComponent, MovimentacaoContaPesquisaComponent
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
    MovimentacaoContaCadastroComponent, MovimentacaoContaPesquisaComponent
  ]
})
export class MovimentacoesContaModule { }
