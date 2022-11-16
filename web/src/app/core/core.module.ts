
// tslint:disable-next-line: max-line-length
import { AgendamentoCadastroDialogComponent } from './../modulos/agendamento/agendamento-cadastro-dialog/agendamento-cadastro-dialog.component';
import { Atendente } from 'src/app/core/model';
import { ClienteService } from './../servicos/cliente.service';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DecimalPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { RouterModule } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';

import { ConfirmationService, DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import { ProgressBarModule } from 'primeng/progressbar';
import { BlockUIModule } from 'primeng/blockui';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';

import { UtilService } from './../shared/util.service';
import { ConfigService } from './../shared/config.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ErrorHandlerService } from './error-handler.service';
import { ToastModule } from 'primeng/toast';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { AuthService } from './../seguranca/auth.service';
import { CustomHttp } from './../seguranca/custom-http';
import { HomeComponent } from './home/home.component';
import { ZeroEsquerdaPipe } from './zero-esquerda.pipe';
import { HoraBrPipe } from './hora-br.pipe';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { UsuarioService } from 'src/app/servicos/usuario.service';
import { FornecedorService } from 'src/app/servicos/fornecedor.service';
import { ContaService } from 'src/app/servicos/conta.service';
import { MovimentacaoContaService } from 'src/app/servicos/movimentacao-conta.service';
import { FormaPagamentoService } from 'src/app/servicos/forma-pagamento.service';
import { DuplicataPagarService } from 'src/app/servicos/duplicata-pagar.service';
import { AgendaService } from 'src/app/servicos/agenda.service';
import { ProdutoServicoService } from 'src/app/servicos/produto-servico.service';
import { EntradaService } from 'src/app/servicos/entrada.service';

import { FooterComponent } from './footer/footer.component';
import { AutoFucosDirective } from './auto-focus.directive';
import { AgendamentoCadastroDialogService } from '../servicos/agendamento-cadastro-dialog.service';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent,
    HomeComponent,
    ZeroEsquerdaPipe,
    HoraBrPipe,
    AutoFucosDirective,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ToastModule,
    HttpClientModule,
    SidebarModule,
    ProgressBarModule,
    BlockUIModule,
    PanelMenuModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    FormsModule,
    DynamicDialogModule,

    ConfirmDialogModule
  ],
  exports: [
    ToastModule,
    ConfirmDialogModule,
    ZeroEsquerdaPipe,
    HoraBrPipe,
    AutoFucosDirective,

    NavbarComponent,
    FooterComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    MessageService,
    ConfirmationService,
    Title,
    JwtHelperService,
    DecimalPipe,
    DialogService,

    CustomHttp,
    AuthService,
    ErrorHandlerService,
    ConfigService,
    UtilService,
    UsuarioService,
    ClienteService,
    FornecedorService,
    ContaService,
    MovimentacaoContaService,
    FormaPagamentoService,
    AgendaService,
    DuplicataPagarService,
    EntradaService,
    AgendamentoCadastroDialogService,
    ProdutoServicoService
  ],
  entryComponents: [
    AgendamentoCadastroDialogComponent,

]
})
export class CoreModule { }
