/**
 * Componente simples de mensagem de aviso tendo apenas botão OK
 * @module SimplesMessageDialog
 * @category Componentes
 */

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';

import { Container } from './styles';

/**
 * @typedef SimplesMessageDialogProps
 * @property {} title Título da janela
 * @property {} visible Deixa a janela visivel
 * @property {} setVisible Handle para controle do estado visible
 * @property {string | any} children
 */

interface IProps {
  title?: string;
  visible?: boolean;
  setVisible?: (value: boolean) => void;
  handleOk?: () => void;
  children: React.ReactNode;
}
/**
 * Componente SimplesMessageDialog
 * @func SimplesMessageDialog
 * @param {SimplesMessageDialogProps} props Propriedades
 */
export default function SimplesMessageDialog(props: IProps) {
  const { visible, title, setVisible, handleOk, children } = props;

  const footer = (
    <div>
      <Button
        label="Ok"
        style={{ minWidth: 120 }}
        icon="pi pi-check"
        onClick={() => {
          if (handleOk) {
            handleOk();
          }
          if (setVisible) {
            setVisible(false);
          }
        }}
        className="p-button-success"
      />
      <Button
        label="Cancelar"
        icon="pi pi-check"
        style={{ minWidth: 120 }}
        onClick={() => {
          if (setVisible) {
            setVisible(false);
          }
        }}
        className="p-button-danger"
      />
    </div>
  );

  return (
    <Container>
      <Dialog
        closable={false}
        footer={footer}
        header={title || 'Informação'}
        visible={visible}
        style={{ minWidth: '350px', maxWidth: '450px', width: '95%' }}
        modal
        onHide={() => {
          if (setVisible) {
            setVisible(false);
          }
        }}
      >
        {children}
      </Dialog>
    </Container>
  );
}

SimplesMessageDialog.defaultProps = {
  title: 'Informação',
  visible: false,
  setVisible: undefined,
  handleOk: undefined,
};
