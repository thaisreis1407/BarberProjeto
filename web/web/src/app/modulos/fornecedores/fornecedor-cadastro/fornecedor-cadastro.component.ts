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
import { Fornecedor } from 'src/app/core/model';
import { FornecedorService } from 'src/app/servicos/fornecedor.service';

@Component({
  selector: 'app-fornecedor-cadastro',
  templateUrl: './fornecedor-cadastro.component.html',
  styleUrls: ['./fornecedor-cadastro.component.css']
})
export class FornecedorCadastroComponent implements OnInit {
  fornecedors = [];
  listaDias = [
    {label: 'Sem dia Definido', value: 100},
    {label: 'Toda Segunda', value: 101},
    {label: 'Toda Terça', value: 102},
    {label: 'Toda Quarta', value: 103},
    {label: 'Toda Quinta', value: 104},
    {label: 'Toda Sexta', value: 105},
    {label: 'Todo Sábado', value: 106},
    {label: 'Dia 01', value: 1},
    {label: 'Dia 05', value: 5},
    {label: 'Dia 10', value: 10},
    {label: 'Dia 15', value: 15},
    {label: 'Dia 20', value: 20},
    {label: 'Dia 25', value: 25},
    {label: 'Dia 30', value: 30}
  ];
  modoConsulta = false;
  fornecedor: Fornecedor;
  cfgPtBr: any;

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private fornecedorService: FornecedorService,
    private utilService: UtilService,
    private configService: ConfigService

    ) {
      this.cfgPtBr = this.configService.cfgTablePtBr;
      const idFornecedor = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idFornecedor) {
        this.fornecedor = new Fornecedor();
        this.carregarLancamento(idFornecedor);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('Fornecedor');
  }

  private carregarLancamento(id: number) {
    this.fornecedorService.buscarPorId(id)
      .then(fornecedor => {
        this.fornecedor = fornecedor;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.fornecedor = new Fornecedor();
    this.fornecedor.id = 0;
    this.fornecedor.nome = '';
    this.fornecedor.inativo = false;
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/fornecedores']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/fornecedores']);
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
    if (this.fornecedor.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.fornecedorService.adicionar(this.fornecedor)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/fornecedores']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }

  atualizar(form: FormControl) {
    this.fornecedorService.atualizar(this.fornecedor)
    .then(agendaAtualizada => {
      this.fornecedor = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/fornecedores']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.fornecedor.id);
  }

}
