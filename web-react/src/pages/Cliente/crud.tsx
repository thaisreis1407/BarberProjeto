import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ButtonTh from '../../components/ButtonTh';
import DropdownTh from '../../components/DropdownTh';
import InputMaskTh from '../../components/InputMaskTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import ClienteService from '../../services/ClienteService';
import { errorHandle, formatDate, validateFields } from '../../util/functions';
import { ClienteModel } from '../../util/Models';
import { StateScreen } from '../constants';

interface IProps {
  stateScreen: string;
  idSelected: number;
  onClose: (ret?: any) => void;
}
export default function ClienteCrud(props: IProps) {
  const { stateScreen, idSelected, onClose } = props;

  // useMemos
  // const usuarioLogado = useMemo(() => AuthService.getUsuario(), []);

  // interface IDropDown {
  //   label: string;
  //   value: any;
  // }

  // states
  const [cliente, setCliente] = useState(new ClienteModel());

  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [errorLoadRecord, setErrorLoadRecord] = useState(false);

  // useCallbacks
  const loadRecord = useCallback(async (_id: number) => {
    try {
      const retorno = await ClienteService.buscaPorId(_id);
      setCliente(retorno);
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
        retorno = await ClienteService.adicionar(cliente);
      } else {
        retorno = await ClienteService.atualizar(cliente);
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
      const novo = new ClienteModel();

      setCliente(novo);
    }
    setSenha('');
    setConfirmSenha('');
  }, [loadRecord, idSelected, stateScreen]);

  // const perfilAdministrador = AuthService.getUsuario().idClientePerfil === 1;

  // render principal
  return (
    <div className="grid">
      <div className="col-12 sm:col-6 lg:col-6 p-fluid">
        <LabelTh>Nome</LabelTh>
        <InputTextTh
          value={cliente.nome}
          maxLength={40}
          required
          disabled={viewMode()}
          onChange={(e) => {
            setCliente({ ...cliente, nome: e.target.value });
          }}
        />
      </div>
      <div className="col-12 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Responsável</LabelTh>
        <InputTextTh
          value={cliente.responsavel}
          maxLength={40}
          disabled={viewMode()}
          onChange={(e) => {
            setCliente({ ...cliente, responsavel: e.target.value });
          }}
        />
      </div>
      <div className="col-6 sm:col-2 lg:col-2 p-fluid">
        <LabelTh>Inativo?</LabelTh>
        <DropdownTh
          value={cliente.inativo}
          options={[
            { label: 'Sim', value: true },
            { label: 'Não', value: false },
          ]}
          disabled={viewMode()}
          filterInputAutoFocus={false}
          onChange={(e) => {
            setCliente({ ...cliente, inativo: e.target.value });
          }}
        />
      </div>
      <div className="col-6 sm:col-4 lg:col-3 p-fluid">
        <LabelTh>Último Corte</LabelTh>
        <InputTextTh
          disabled
          value={formatDate(cliente.ultimoCorte, 'dd/MM/yyyy')}
          maxLength={40}
        />
      </div>
      <div className="col-6 sm:col-4 lg:col-3 p-fluid">
        <LabelTh>Telefone</LabelTh>
        <InputMaskTh
          mask="(99)9999-9999"
          value={cliente.telefone}
          disabled={viewMode()}
          onChange={(e) => {
            setCliente({ ...cliente, telefone: e.target.value });
          }}
        />
      </div>
      <div className="col-6 sm:col-4 lg:col-3 p-fluid">
        <LabelTh>Celular</LabelTh>
        <InputMaskTh
          mask="(99)99999-9999"
          value={cliente.celular}
          disabled={viewMode()}
          onChange={(e) => {
            setCliente({ ...cliente, celular: e.target.value });
          }}
        />
      </div>

      <div className="col-12 lg:col-12" style={{ textAlign: 'start' }}>
        {!viewMode() ? (
          <ButtonTh
            className="p-button-success"
            icon="pi pi-save"
            label="Salvar"
            disabled={!validateFields(cliente, ['nome'])}
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
