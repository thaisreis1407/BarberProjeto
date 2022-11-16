import { ConfigService } from './../../../shared/config.service';

import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/components/common/api';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/seguranca/auth.service';
import { MensagemService } from 'src/app/shared/mensagem.service';
import { UtilService } from 'src/app/shared/util.service';
import { Cliente } from 'src/app/core/model';
import { ClienteService } from 'src/app/servicos/cliente.service';

@Component({
  selector: 'app-cliente-cadastro',
  templateUrl: './cliente-cadastro.component.html',
  styleUrls: ['./cliente-cadastro.component.css']
})
export class ClienteCadastroComponent implements OnInit {
  clientes = [];
  modoConsulta = false;
  cliente: Cliente;
  cfgPtBr: any;

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private clienteService: ClienteService,
    private utilService: UtilService,
    private configService: ConfigService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idCliente = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idCliente) {
        this.cliente = new Cliente();
        this.carregarLancamento(idCliente);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('Cliente');
  }

  private carregarLancamento(id: number) {
    this.clienteService.buscarPorId(id)
      .then(cliente => {
        this.cliente = cliente;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.cliente = new Cliente();
    this.cliente.id = 0;
    this.cliente.nome = '';
    this.cliente.inativo = false;
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/clientes']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/clientes']);
        }
      });
    }
  }

  confirmarDados(form: FormControl) {
    this.confirmation.confirm({
      message: 'Confirma dados?',
      accept: () => {
        this.salvar(form);
      }
    });
  }

  salvar(form: FormControl) {
    if (this.cliente.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.clienteService.adicionar(this.cliente)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/clientes']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }


  atualizar(form: FormControl) {
    this.clienteService.atualizar(this.cliente)
    .then(agendaAtualizada => {
      this.cliente = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/clientes']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.cliente.id);
  }


}
