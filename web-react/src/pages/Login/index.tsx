/* eslint-disable jsx-a11y/alt-text */
/**
 * Página Login
 * @module Login
 * @category Pages
 */

import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import background from '../../assets/images/logo.png';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { loginRequest } from '../../store/modules/auth/actions';
import { Container } from './styles';

export default function Login() {
  const [senha, setSenha] = useState('');
  const [usuario, setUsuario] = useState('');

  const dispatch = useDispatch();

  function handleSubmit(e: any) {
    e.preventDefault();
    dispatch(loginRequest(usuario, senha, '/home'));
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="col-12" style={{ textAlign: 'center' }}>
            <img className="logo" src={background} />
          </div>

          <div className="col-12">
            <LabelTh>Login</LabelTh>
            <div className="p-inputgroup">
              <InputTextTh
                type="text"
                name="usuario"
                placeholder="Usuário"
                required
                value={usuario}
                onChange={(e: any) => setUsuario(e.target.value)}
              />
              <span className="p-inputgroup-addon">
                <i className="pi pi-user" />
              </span>
            </div>
          </div>
          <div className="col-12">
            <LabelTh>Senha</LabelTh>
            <div className="p-inputgroup">
              <InputTextTh
                type="password"
                name="password"
                placeholder="sua senha"
                required
                value={senha}
                onChange={(e: any) => setSenha(e.target.value)}
              />
              <span className="p-inputgroup-addon">
                <i className="pi pi-key" />
              </span>
            </div>
          </div>

          <div className="col-12">
            <Button
              className="p-button-success"
              style={{ width: '100%' }}
              type="submit"
              label="Login"
              disabled={!(usuario && senha)}
            />
          </div>
        </div>
      </form>
    </Container>
  );
}
