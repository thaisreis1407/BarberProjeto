import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ButtonTh from '../../components/ButtonTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import DuplicataPagarService from '../../services/DuplicataPagarService';
import { errorHandle, formatFloat, validateFields } from '../../util/functions';
import { DuplicataPagarModel } from '../../util/Models';
import { StateScreen } from '../constants';

interface IProps {
  stateScreen: string;
  idSelected: number;
  onClose: (ret?: any) => void;
}
export default function DuplicataPagarCrud(props: IProps) {
  const { stateScreen, idSelected, onClose } = props;

  // states
  const [duplicataPagar, setDuplicataPagar] = useState(new DuplicataPagarModel());

  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [errorLoadRecord, setErrorLoadRecord] = useState(false);

  // useCallbacks
  const loadRecord = useCallback(async (_id: number) => {
    try {
      const retorno = await DuplicataPagarService.buscaPorId(_id);
      setDuplicataPagar(retorno);
      setErrorLoadRecord(false);
    } catch (err) {
      setErrorLoadRecord(true);
      errorHandle(err);
    }
  }, []);

  // funcoes
  function viewMode() {
    return stateScreen === StateScreen.stView || errorLoadRecord;
  }

  function handleBack() {
    if (stateScreen === StateScreen.stView) {
      onClose();
    } else {
      showMessage('Confirmação', 'Abandonar mudanças?', (idx: number) => {
        if (idx === 1) {
          onClose();
        }
      });
    }
  }

  function handleSave() {
    if (stateScreen === StateScreen.stView) {
      onClose();
    } else {
      salvarRecord();
    }
  }

  async function salvarRecord() {
    if (senha || confirmSenha) {
      if (senha !== confirmSenha) {
        toast.warn('Senha e confirmação não conferem.');
        return;
      }
    }

    try {
      let retorno: any;
      if (stateScreen === StateScreen.stInsert) {
        retorno = await DuplicataPagarService.adicionar(duplicataPagar);
      } else {
        retorno = await DuplicataPagarService.atualizar(duplicataPagar);
      }
      toast.success('Registro salvo com sucesso.');
      onClose(retorno);
    } catch (err) {
      errorHandle(err);
    }
  }

  // useEffects
  useEffect(() => {
    if (stateScreen === StateScreen.stUpdate || stateScreen === StateScreen.stView) {
      loadRecord(idSelected);
    } else if (stateScreen === StateScreen.stInsert) {
      const novo = new DuplicataPagarModel();

      setDuplicataPagar(novo);
    }
    setSenha('');
    setConfirmSenha('');
  }, [loadRecord, idSelected, stateScreen]);

  // const perfilAdministrador = AuthService.getUsuario().idDuplicataPagarPerfil === 1;

  // render principal
  return (
    <div className="grid">
      {/* <div className="col-12 sm:col-8 lg:col-8 p-fluid">
        <LabelTh>Descricao</LabelTh>
        <InputTextTh
          value={duplicataPagar.descricao}
          maxLength={40}
          required
          disabled={viewMode()}
          onChange={(e) => {
            setDuplicataPagar({ ...duplicataPagar, descricao: e.target.value });
          }}
        />
      </div>
      <div className="col-6 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Saldo</LabelTh>
        <InputTextTh disabled value={formatFloat(duplicataPagar.saldo, 2)} maxLength={40} />
      </div> */}

      <div className="col-12 lg:col-12" style={{ textAlign: 'start' }}>
        {!viewMode() ? (
          <ButtonTh
            className="p-button-success"
            icon="pi pi-save"
            label="Salvar"
            disabled={!validateFields(duplicataPagar, ['descricao'])}
            showConfirmation
            onClick={handleSave}
          />
        ) : null}
        <ButtonTh
          className="p-button-secondary"
          label="Voltar"
          icon="pi pi-chevron-circle-left"
          onClick={handleBack}
        />
      </div>
    </div>
  );
}
