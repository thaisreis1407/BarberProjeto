
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/components/common/api';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/seguranca/auth.service';
import { MensagemService } from 'src/app/shared/mensagem.service';
import { UtilService } from 'src/app/shared/util.service';
import { Usuario } from 'src/app/core/model';
import { UsuarioService } from 'src/app/servicos/usuario.service';

@Component({
  selector: 'app-usuario-cadastro',
  templateUrl: './usuario-cadastro.component.html',
  styleUrls: ['./usuario-cadastro.component.css']
})
export class UsuarioCadastroComponent implements OnInit {
  usuarios = [];
  modoConsulta = false;
  usuario: Usuario;
  regionais = [];
  gerentes = [];
  supervisores = [];
  perfis = [
    { label: 'ADMINISTRADOR', value: 'ADMINISTRADOR'},
    { label: 'GERENTE', value: 'GERENTE'},
    { label: 'FUNCIONARIO', value: 'FUNCIONARIO'},
    { label: 'CLIENTE', value: 'CLIENTE'}
  ];
  confirmacaoSenha = '';
  senha = '';

  constructor(
    private mensagemService: MensagemService,
    private confirmation: ConfirmationService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private title: Title,
    public auth: AuthService,
    private router: Router,
    private usuarioService: UsuarioService,
    private utilService: UtilService,

    ) {
      const idUsuario = this.route.snapshot.params['id'];
      this.modoConsulta =  this.route.snapshot.params['consulta'] === 'consulta';

      if (idUsuario) {
        this.usuario = new Usuario();
        this.carregarLancamento(idUsuario);
      } else {
        this.novo();
      }
  }

  ngOnInit() {
    this.title.setTitle('Usuario');
  }

  private carregarLancamento(id: number) {
    this.usuarioService.buscarPorId(id)
      .then(usuario => {
        this.usuario = usuario;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
  telaMobile() {
    return this.utilService.telaMobile();
  }

  novo() {
    this.usuario = new Usuario();
    this.usuario.id = 0;
    this.usuario.login = '';
  }

  voltar() {
    if (this.modoConsulta) {
      this.router.navigate(['/usuarios']);
    } else {
      this.confirmation.confirm({
        message: 'Voltar para listagem?',
        accept: () => {
          this.router.navigate(['/usuarios']);
        }
      });
    }
  }

  confirmarDados(form: FormControl) {
    this.confirmation.confirm({
      message: 'Confirma dados?',
      accept: () => {
        if (this.senha !== this.confirmacaoSenha) {
          this.mensagemService.erro('Senha diverge da confirmação.');
        } else {
          this.usuario.senha = this.senha;
          this.salvar(form);
        }
      }
    });
  }

  salvar(form: FormControl) {
    if (this.usuario.id > 0) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.usuarioService.adicionar(this.usuario)
    .then(( ) => {
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/usuarios']);
    })
    .catch(erro => {
      this.errorHandler.handle(erro);
    });
  }


  atualizar(form: FormControl) {
    this.usuarioService.atualizar(this.usuario)
    .then(agendaAtualizada => {
      this.usuario = agendaAtualizada;
      this.mensagemService.sucesso('Registro salvo com sucesso.');
      this.router.navigate(['/usuarios']);
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.usuario.id);
  }


}
