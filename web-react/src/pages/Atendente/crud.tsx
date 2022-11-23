import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ButtonTh from '../../components/ButtonTh';
import DropdownTh from '../../components/DropdownTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import AtendenteService from '../../services/AtendenteService';
import ContaService from '../../services/ContaService';
import { errorHandle, validateFields } from '../../util/functions';
import { AtendenteModel } from '../../util/Models';
import { StateScreen } from '../constants';

interface IProps {
  stateScreen: string;
  idSelected: number;
  onClose: (ret?: any) => void;
}

interface IDropdownItems {
  value: string;
  label: string;
}

export default function AtendenteCrud(props: IProps) {
  const { stateScreen, idSelected, onClose } = props;

  // states
  const [atendente, setAtendente] = useState(new AtendenteModel());

  const [errorLoadRecord, setErrorLoadRecord] = useState(false);
  const [contas, setContas] = useState<IDropdownItems[]>([]);

  // useCallbacks
  const loadRecord = useCallback(async (_id: number) => {
    try {
      const retorno = await AtendenteService.buscaPorId(_id);
      setAtendente(retorno);
      setErrorLoadRecord(false);
    } catch (err) {
      setErrorLoadRecord(true);
      errorHandle(err);
    }
  }, []);

  const loadConta = useCallback(async () => {
    const r = await ContaService.consulta({ limit: 50 });

    const retorno = r.content.map((e: any) => {
      return {
        label: e.descricao,
        value: e.id,
      };
    });
    setContas(retorno);
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
      let retorno: any;
      const atendenteSalvar = { ...atendente };
      atendenteSalvar.conta = {
        id: atendente.idContaComissao,
        descricao: '',
        saldo: 0,
      };

      if (stateScreen === StateScreen.stInsert) {
        retorno = await AtendenteService.adicionar(atendenteSalvar);
      } else {
        retorno = await AtendenteService.atualizar(atendenteSalvar);
      }
      toast.success('Registro salvo com sucesso.');
      onClose(retorno);
    } catch (err) {
      errorHandle(err);
    }
  }

  // useEffects
  useEffect(() => {
    loadConta();
    if (stateScreen === StateScreen.stUpdate || stateScreen === StateScreen.stView) {
      loadRecord(idSelected);
    } else if (stateScreen === StateScreen.stInsert) {
      const novo = new AtendenteModel();

      setAtendente(novo);
    }
  }, [loadRecord, idSelected, stateScreen, loadConta]);

  // render principal
  return (
    <div className="grid">
      <div className="col-12 sm:col-5 lg:col-4 p-fluid">
        <LabelTh>Nome</LabelTh>
        <InputTextTh
          value={atendente.nome}
          maxLength={40}
          required
          disabled={viewMode()}
          onChange={(e) => {
            setAtendente({ ...atendente, nome: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Conta</LabelTh>
        <DropdownTh
          value={atendente.idContaComissao}
          options={contas}
          disabled={viewMode()}
          filterInputAutoFocus={false}
          required
          placeholder="Selecione"
          onChange={(e) => {
            setAtendente({ ...atendente, idContaComissao: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-3 lg:col-2 p-fluid">
        <LabelTh>Inativo</LabelTh>
        <DropdownTh
          value={atendente.inativo}
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
            setAtendente({ ...atendente, inativo: e.target.value });
          }}
        />
      </div>

      <div className="col-12 lg:col-12" style={{ textAlign: 'start' }}>
        {!viewMode() ? (
          <ButtonTh
            className="p-button-success"
            icon="pi pi-save"
            label="Salvar"
            disabled={!validateFields(atendente, ['nome', 'idContaComissao'])}
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
