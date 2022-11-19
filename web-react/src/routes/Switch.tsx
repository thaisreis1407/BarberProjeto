/* eslint-disable react/no-array-index-key */
/**
 * Módulo auxiliar das configurações de rota
 * @module Route
 * @category Rotas
 */

import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

import AuthLayout from '../layouts/Auth';
import App from '../layouts/Default';
import AuthService from '../services/AuthService';

interface IRouteElement {
  element: JSX.Element;
  roles?: any[];
  isPrivate?: boolean;
  path: string;
}

interface IProps {
  routes: IRouteElement[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Switch: React.FC<IProps> = (props: IProps) => {
  const { routes } = props;

  return (
    <Routes>
      {routes.map(({ roles, path, element, isPrivate }, i) => {
        let redirect: any = null;
        if (!roles) {
          roles = [];
        }
        // se isPrivate nao tiver definida e roles existir, então define private true
        if (!isPrivate && roles.length > 0) {
          isPrivate = true;
        }

        let { signed } = AuthService.acessToken();

        if (path === '/login') {
          signed = false;
        }

        // se for diferente de /login e nao tiver logado vai para login
        if (!redirect && !signed && path !== '/login') {
          redirect = <Navigate to="/login" />;
        }

        if (!redirect && !signed && isPrivate) {
          redirect = <Navigate to="/login" />;
        }

        if (!redirect && signed && !isPrivate) {
          redirect = <Navigate to="/home" />;
          // window.location.href = '/home';
          // return null;
        }

        if (!redirect && roles.length > 0 && !AuthService.checkRoles(roles)) {
          redirect = <Navigate to="/denied" />;
          // window.location.href = '/denied';
          // return null;
        }

        const Layout = signed ? App : AuthLayout;
        return redirect ? (
          <Route key={i} path={path} element={redirect} />
        ) : (
          <Route key={i} path={path} element={<Layout>{element}</Layout>} />
        );
      })}
    </Routes>
  );
};

export default Switch;
