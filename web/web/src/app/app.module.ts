import { ProdutosServicosModule } from './modulos/produtos-servicos/produtos-servico.module';
import { AgendamentosModule } from './modulos/agendamento/agendamentos.module';
import { AgendaModule } from './modulos/agendas/agendas.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DeviceDetectorModule } from 'ngx-device-detector';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SegurancaModule } from './seguranca/seguranca.module';
import { AppRoutingModule } from './app.routing.module';
import { UsuariosModule } from './modulos/usuarios/usuarios.module';
import { FornecedoresModule } from './modulos/fornecedores/fornecedores.module';
import { ContasModule } from './modulos/contas/contas.module';

import { FormasPagamentoModule } from './modulos/formas-pagamento/formas-pagamento.module';
import { MovimentacoesContaModule } from './modulos/movimentacoes-conta/movimentacoes-conta.module';
import { ClientesModule } from './modulos/clientes/clientes.module';
import { AtendentesModule } from './modulos/atendentes/atendentes.module';
import { DuplicatasPagarModule } from './modulos/duplicatas-pagar/duplicatas-pagar.module';
import { EntradaModule } from './modulos/entradas/entrada.module';

import { JwtHttpInterceptor } from './seguranca/jwt-http-interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    SegurancaModule,
    CoreModule,
    UsuariosModule,
    ClientesModule,
    FornecedoresModule,
    ContasModule,
    ProdutosServicosModule,
    FormasPagamentoModule,
    MovimentacoesContaModule,
    AtendentesModule,
    DuplicatasPagarModule,
    AgendaModule,
    EntradaModule,
    AgendamentosModule,
    AppRoutingModule,

    DeviceDetectorModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
