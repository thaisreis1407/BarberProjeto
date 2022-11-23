import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ButtonTh from '../../components/ButtonTh';
import DropdownTh from '../../components/DropdownTh';
import InputMaskTh from '../../components/InputMaskTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import { listaDiasVencimento } from '../../config/Constantes';
import FornecedorService from '../../services/FornecedorService';
import { errorHandle, validateFields } from '../../util/functions';
import { FornecedorModel } from '../../util/Models';
import { StateScreen } from '../constants';

interface IProps {
  stateScreen: string;
  idSelected: number;
  onClose: (ret?: any) => void;
}

export default function FornecedorCrud(props: IProps) {
  const { stateScreen, idSelected, onClose } = props;

  // states
  const [fornecedor, setFornecedor] = useState(new FornecedorModel());

  const [errorLoadRecord, setErrorLoadRecord] = useState(false);

  // useCallbacks
  const loadRecord = useCallback(async (_id: number) => {
    try {
      const retorno = await FornecedorService.buscaPorId(_id);
      setFornecedor(retorno);
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
      let retorno: any;

      if (stateScreen === StateScreen.stInsert) {
        retorno = await FornecedorService.adicionar(fornecedor);
      } else {
        retorno = await FornecedorService.atualizar(fornecedor);
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
      const novo = new FornecedorModel();

      setFornecedor(novo);
    }
  }, [loadRecord, idSelected, stateScreen]);

  // render principal
  return (
    <div className="grid">
      <div className="col-12 sm:col-6 lg:col-5 p-fluid">
        <LabelTh>Nome</LabelTh>
        <InputTextTh
          value={fornecedor.nome}
          maxLength={40}
          required
          disabled={viewMode()}
          onChange={(e) => {
            setFornecedor({ ...fornecedor, nome: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-3 lg:col-2 p-fluid">
        <LabelTh>Inativo</LabelTh>
        <DropdownTh
          value={fornecedor.inativo}
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
            setFornecedor({ ...fornecedor, inativo: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-3 lg:col-2 p-fluid">
        <LabelTh>Dia Vencimento</LabelTh>
        <DropdownTh
          value={fornecedor.diaVencimento}
          options={listaDiasVencimento}
          disabled={viewMode()}
          filterInputAutoFocus={false}
          placeholder="Selecione"
          filter
          required
          onChange={(e) => {
            setFornecedor({ ...fornecedor, diaVencimento: e.target.value });
          }}
        />
      </div>

      <div className="col-12 sm:col-4 lg:col-3 p-fluid">
        <LabelTh>Telefone</LabelTh>
        <InputMaskTh
          mask="(99)9999-9999"
          value={fornecedor.telefone}
          disabled={viewMode()}
          onChange={(e) => {
            setFornecedor({ ...fornecedor, telefone: e.target.value });
          }}
        />
      </div>

      <div className="col-12 lg:col-12" style={{ textAlign: 'start' }}>
        {!viewMode() ? (
          <ButtonTh
            className="p-button-success"
            icon="pi pi-save"
            label="Salvar"
            disabled={!validateFields(fornecedor, ['nome', 'diaVencimento'])}
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
