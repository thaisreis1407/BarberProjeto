import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ButtonTh from '../../components/ButtonTh';
import DropdownTh from '../../components/DropdownTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import { listaPerfis } from '../../config/Constantes';
import UsuarioService from '../../services/UsuarioService';
import { errorHandle, validateFields } from '../../util/functions';
import { UsuarioModel } from '../../util/Models';
import { StateScreen } from '../constants';

interface IProps {
  stateScreen: string;
  idSelected: number;
  onClose: (ret?: any) => void;
}

export default function UsuarioCrud(props: IProps) {
  const { stateScreen, idSelected, onClose } = props;

  // states
  const [usuario, setUsuario] = useState(new UsuarioModel());
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');

  const [errorLoadRecord, setErrorLoadRecord] = useState(false);

  // useCallbacks
  const loadRecord = useCallback(async (_id: number) => {
    try {
      const retorno = await UsuarioService.buscaPorId(_id);
      setUsuario(retorno);
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
    try {
      if (senha !== confirmacaoSenha) {
        toast.warning('Senha diverge da confirmação');
        return;
      }
      let retorno: any;
      const usuarioSalvar: UsuarioModel = { ...usuario, senha };

      if (stateScreen === StateScreen.stInsert) {
        retorno = await UsuarioService.adicionar(usuarioSalvar);
      } else {
        retorno = await UsuarioService.atualizar(usuarioSalvar);
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
      const novo = new UsuarioModel();

      setUsuario(novo);
    }
  }, [loadRecord, idSelected, stateScreen]);

  // render principal
  return (
    <div className="grid">
      <div className="col-12 sm:col-5 lg:col-5 p-fluid">
        <LabelTh>Login</LabelTh>
        <InputTextTh
          value={usuario.login}
          maxLength={40}
          required
          disabled={viewMode()}
          onChange={(e) => {
            setUsuario({ ...usuario, login: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Perfi</LabelTh>
        <DropdownTh
          value={usuario.perfil}
          options={listaPerfis}
          disabled={viewMode()}
          filterInputAutoFocus={false}
          required
          placeholder="Selecione"
          onChange={(e) => {
            setUsuario({ ...usuario, perfil: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-3 lg:col-3 p-fluid">
        <LabelTh>Inativo</LabelTh>
        <DropdownTh
          value={usuario.inativo}
          options={[
            {
              value: true,
              label: 'Sim',
            },
            {
              value: false,
              label: 'Não',
            },
          ]}
          disabled={viewMode()}
          filterInputAutoFocus={false}
          placeholder="Selecione"
          onChange={(e) => {
            setUsuario({ ...usuario, inativo: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Senha</LabelTh>
        <InputTextTh
          value={senha}
          maxLength={10}
          required={!!confirmacaoSenha || !!senha || stateScreen === StateScreen.stInsert}
          type="password"
          disabled={viewMode()}
          onChange={(e) => {
            setSenha(e.target.value);
          }}
        />
      </div>

      <div className="col-6 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Confirmação</LabelTh>
        <InputTextTh
          value={confirmacaoSenha}
          maxLength={10}
          required={!!confirmacaoSenha || !!senha || stateScreen === StateScreen.stInsert}
          type="password"
          disabled={viewMode()}
          onChange={(e) => {
            setConfirmacaoSenha(e.target.value);
          }}
        />
      </div>

      <div className="col-12 lg:col-12" style={{ textAlign: 'start' }}>
        {!viewMode() ? (
          <ButtonTh
            className="p-button-success"
            icon="pi pi-save"
            label="Salvar"
            disabled={
              !validateFields(usuario, ['login', 'perfil']) ||
              (!senha && stateScreen === StateScreen.stInsert)
            }
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
