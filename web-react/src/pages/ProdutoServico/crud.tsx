import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ButtonTh from '../../components/ButtonTh';
import DropdownTh from '../../components/DropdownTh';
import InputCurrencyTh from '../../components/InputCurrencyTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import ProdutoServicoService from '../../services/ProdutoServicoService';
import { errorHandle, formatFloat, validateFields } from '../../util/functions';
import { ProdutoServicoModel } from '../../util/Models';
import { StateScreen } from '../constants';

interface IProps {
  stateScreen: string;
  idSelected: number;
  onClose: (ret?: any) => void;
}
export default function ProdutoServicoCrud(props: IProps) {
  const { stateScreen, idSelected, onClose } = props;

  // states
  const [produtoServico, setProdutoServico] = useState(new ProdutoServicoModel());

  const [errorLoadRecord, setErrorLoadRecord] = useState(false);

  // useCallbacks
  const loadRecord = useCallback(async (_id: number) => {
    try {
      const retorno = await ProdutoServicoService.buscaPorId(_id);
      setProdutoServico(retorno);
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
        retorno = await ProdutoServicoService.adicionar(produtoServico);
      } else {
        retorno = await ProdutoServicoService.atualizar(produtoServico);
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
      const novo = new ProdutoServicoModel();

      setProdutoServico(novo);
    }
  }, [loadRecord, idSelected, stateScreen]);

  // const perfilAdministrador = AuthService.getUsuario().idProdutoServicoPerfil === 1;

  // render principal
  return (
    <div className="grid">
      <div className="col-4 sm:col-3 lg:col-2 p-fluid">
        <LabelTh>Tipo</LabelTh>
        <DropdownTh
          value={produtoServico.tipo}
          options={[
            { label: 'Produto', value: 0 },
            { label: 'Serviço', value: 1 },
          ]}
          disabled={viewMode()}
          filterInputAutoFocus={false}
          onChange={(e) => {
            setProdutoServico({ ...produtoServico, tipo: e.target.value });
          }}
        />
      </div>

      <div className="col-8 sm:col-6 lg:col-6 p-fluid">
        <LabelTh>Descricao</LabelTh>
        <InputTextTh
          value={produtoServico.descricao}
          maxLength={40}
          required
          disabled={viewMode()}
          onChange={(e) => {
            setProdutoServico({ ...produtoServico, descricao: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-3 lg:col-2 p-fluid">
        <LabelTh>Custo</LabelTh>
        <InputCurrencyTh
          value={produtoServico.custo}
          digits={2}
          disabled={viewMode()}
          onChangeNumber={(_e, n) => {
            setProdutoServico({ ...produtoServico, custo: n });
          }}
        />
      </div>

      <div className="col-6 sm:col-3 lg:col-2 p-fluid">
        <LabelTh>Valor</LabelTh>
        <InputCurrencyTh
          value={produtoServico.valor}
          digits={2}
          disabled={viewMode()}
          onChangeNumber={(_e, n) => {
            setProdutoServico({ ...produtoServico, valor: n });
          }}
        />
      </div>

      <div className="col-6 sm:col-2 lg:col-2 p-fluid">
        <LabelTh>Bloqueado</LabelTh>
        <DropdownTh
          value={produtoServico.bloqueado}
          options={[
            { label: 'Sim', value: true },
            { label: 'Não', value: false },
          ]}
          disabled={viewMode()}
          filterInputAutoFocus={false}
          onChange={(e) => {
            setProdutoServico({ ...produtoServico, bloqueado: e.target.value });
          }}
        />
      </div>
      <div className="col-6 sm:col-4 lg:col-3 p-fluid">
        <LabelTh>Saldo</LabelTh>
        <InputTextTh disabled value={formatFloat(produtoServico.saldo, 2)} maxLength={40} />
      </div>

      <div className="col-12 lg:col-12" style={{ textAlign: 'start' }}>
        {!viewMode() ? (
          <ButtonTh
            className="p-button-success"
            icon="pi pi-save"
            label="Salvar"
            disabled={!validateFields(produtoServico, ['descricao'])}
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
