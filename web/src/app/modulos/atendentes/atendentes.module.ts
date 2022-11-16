import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';

import { CoreModule } from 'src/app/core/core.module';
import { AtendentePesquisaComponent } from './atendente-pesquisa/atendente-pesquisa.component';
import { AtendenteCadastroComponent } from './atendente-cadastro/atendente-cadastro.component';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    AtendenteCadastroComponent, AtendentePesquisaComponent
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
    MenuModule
  ],
  exports: [
    AtendenteCadastroComponent, AtendentePesquisaComponent
  ]
})
export class AtendentesModule { }
