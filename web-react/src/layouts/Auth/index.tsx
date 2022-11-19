/**
 * Componente AuthLayout utilizado para página de login
 * @module AuthLayout
 * @category Layout
 */

import React from 'react';

import DisplayBlock from '../../components/DisplayBlock';
import { Wrapper } from './styles';

interface IProps {
  children: React.ReactNode;
}

export default function AuthLayout(props: IProps) {
  const { children } = props;

  return (
    <Wrapper>
      <DisplayBlock />
      <div>{children}</div>
    </Wrapper>
  );
}
