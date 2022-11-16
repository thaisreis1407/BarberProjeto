import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import { CoreModule } from 'src/app/core/core.module';
import { ProdutoServicoPesquisaComponent } from './produto-servico-pesquisa/produto-servico-pesquisa.component';
import { ProdutoServicoCadastroComponent } from './produto-servico-cadastro/produto-servico-cadastro.component';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    ProdutoServicoCadastroComponent, ProdutoServicoPesquisaComponent
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
    CurrencyMaskModule
  ],
  exports: [
    ProdutoServicoCadastroComponent, ProdutoServicoPesquisaComponent
  ]
})
export class ProdutosServicosModule { }
