/* eslint-disable react/no-array-index-key */

import { Dialog } from 'primereact/dialog';
import React from 'react';
import { useSelector } from 'react-redux';

import { store } from '../../store';
import { showDialog, hiddenDialog } from '../../store/modules/dialog/actions';
import ButtonTh from '../ButtonTh';
import { Container } from './styles';

export default function MessageDialog() {
  const { visible, title, body, handleClose, arrayButtons } = useSelector((state: any) => {
    return state.dialog.config;
  });

  function hiddenMessage() {
    const { dispatch } = store;
    dispatch(hiddenDialog());
  }

  let footer = (
    <div>
      <ButtonTh
        autoFocus
        label="Sim"
        icon="pi pi-check"
        onClick={() => {
          hiddenMessage();
          if (handleClose) {
            handleClose(1);
          }
        }}
        className="p-button-success"
      />
      <ButtonTh
        label="Não"
        icon="pi pi-times"
        onClick={() => {
          hiddenMessage();
          if (handleClose) {
            handleClose(2);
          }
        }}
        className="p-button-danger"
      />
    </div>
  );

  if (Array.isArray(arrayButtons) && arrayButtons.length > 0) {
    footer = (
      <div>
        {arrayButtons.map((e, i) => {
          return (
            <ButtonTh
              key={`btnMessageDlg${i}`}
              label={e.label}
              icon={e.icon}
              title={e.title}
              onClick={() => {
                hiddenMessage();
                if (handleClose) {
                  handleClose(i + 1);
                }
              }}
              className={e.className}
            />
          );
        })}
      </div>
    );
  }

  return (
    <Container>
      <Dialog
        closable={false}
        footer={footer}
        header={title || 'Confirmação'}
        visible={visible}
        style={{ minWidth: '350px', maxWidth: '450px', width: '95%' }}
        modal
        onHide={() => {
          hiddenMessage();
          if (handleClose) {
            handleClose(0);
          }
        }}
      >
        {body || ''}
      </Dialog>
    </Container>
  );
}

export function showMessage(title: string, header: any, handleClose: any) {
  const { dispatch } = store;
  dispatch(showDialog(title, header, handleClose, []));
}

export function showMessageCustom(
  title: string,
  header: any,
  arrayButtons: any,
  handleClose: any
) {
  const { dispatch } = store;
  dispatch(showDialog(title, header, handleClose, arrayButtons));
}
