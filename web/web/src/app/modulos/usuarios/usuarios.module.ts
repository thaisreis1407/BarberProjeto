import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';

import { CoreModule } from 'src/app/core/core.module';
import { UsuarioSenhaComponent } from './usuario-senha/usuario-senha.component';
import { UsuarioPesquisaComponent } from './usuario-pesquisa/usuario-pesquisa.component';
import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro.component';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    UsuarioSenhaComponent,
    UsuarioCadastroComponent, UsuarioPesquisaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    TooltipModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    TableModule,
    SplitButtonModule,
    CoreModule,
    MenuModule
  ],
  exports: [
    UsuarioCadastroComponent, UsuarioPesquisaComponent
  ]
})
export class UsuariosModule { }
