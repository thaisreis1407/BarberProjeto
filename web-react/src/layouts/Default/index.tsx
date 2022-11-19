/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { PanelMenu } from 'primereact/panelmenu';
import { Sidebar } from 'primereact/sidebar';
import React, { useState } from 'react';

import DisplayBlock from '../../components/DisplayBlock';
import AuthService from '../../services/AuthService';
import createMenu from '../menu';
import { ContainerMenu, Wrapper } from './styles';

interface IProps {
  children: React.ReactNode;
}

export default function Defaultlayout(props: IProps) {
  const { children } = props;

  const [exibindoMenu, setExibindoMenu] = useState(false);

  const menu = createMenu(setExibindoMenu);

  return (
    <Wrapper>
      <nav className="navbar">
        <div className="container-nav">
          <div className="grid">
            <div className="col-12" style={{ paddingBottom: 0 }}>
              <div className="navebar-botao">
                <span className="navbar-toggle" onClick={() => setExibindoMenu(!exibindoMenu)}>
                  <i className="pi pi-bars" />
                </span>
              </div>

              <div className="navebar-titulo">
                <span>Barber</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Sidebar
        visible={exibindoMenu}
        style={{
          marginTop: 20,
          width: '18em',
          padding: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          marginLeft: 0,
        }}
        showCloseIcon={false}
        onHide={() => setExibindoMenu(false)}
      >
        <ContainerMenu>
          <div className="navbar-usuario">{AuthService.getUsuario().login}</div>
          <PanelMenu style={{ marginLeft: 3, marginTop: 5 }} model={menu} />
        </ContainerMenu>
      </Sidebar>

      <DisplayBlock />
      <div>{children}</div>
    </Wrapper>
  );
}
