/**
 * Página AcessDenied
 * @module AcessDenied
 * @category Pages
 */

import { Button } from 'primereact/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Container } from './styles';

export default function AcessDenied() {
  const navigate = useNavigate();

  return (
    <Container className="container-page" style={{ paddingTop: 150 }}>
      <div className="p-col-12 p-lg-12 p-fluid" style={{ marginBottom: 10 }}>
        <h1 style={{ color: 'red', textAlign: 'center' }}>
          Acesso negado. Verifique suas permissões
        </h1>
      </div>
      <div className="p-col-12" />
      <div className="p-col-12" style={{ textAlign: 'center' }}>
        <Button
          className="p-button-secondary"
          label="Voltar"
          icon="pi pi-chevron-circle-left"
          onClick={() => navigate(-1)}
        />
      </div>
    </Container>
  );
}
