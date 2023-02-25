import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ButtonTh from '../../components/ButtonTh';
import CalendarTh from '../../components/CalendarTh';
import DropdownTh from '../../components/DropdownTh';
import InputCurrencyTh from '../../components/InputCurrencyTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import EntradaService from '../../services/EntradaService';
import ProdutoServicoService from '../../services/ProdutoServicoService';
import { errorHandle, strToDate, validateFields } from '../../util/functions';
import { EntradaModel } from '../../util/Models';
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

export default function EntradaCrud(props: IProps) {
  const { stateScreen, idSelected, onClose } = props;

  // states
  const [entrada, setEntrada] = useState(new EntradaModel());

  const [produtos, setProdutos] = useState<IDropdownItems[]>([]);
  const [errorLoadRecord, setErrorLoadRecord] = useState(false);

  // useCallbacks
  const loadRecord = useCallback(async (_id: number) => {
    try {
      const retorno = await EntradaService.buscaPorId(_id);
      retorno.dataEntrada = strToDate(retorno.dataEntrada);

      setEntrada(retorno);
      setErrorLoadRecord(false);
    } catch (err) {
      setErrorLoadRecord(true);
      errorHandle(err);
    }
  }, []);

  const loadProduto = useCallback(async () => {
    const r = await ProdutoServicoService.consulta({ tipo: 0 });

    const retorno = r.content.map((e: any) => {
      return {
        label: e.descricao,
        value: e.id,
      };
    });
    setProdutos(retorno);
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
      entrada.produtoServico.id = entrada.idProdutoServico;

      if (stateScreen === StateScreen.stInsert) {
        retorno = await EntradaService.adicionar(entrada);
      } else {
        retorno = await EntradaService.atualizar(entrada);
      }
      toast.success('Registro salvo com sucesso.');
      onClose(retorno);
    } catch (err) {
      errorHandle(err);
    }
  }

  // useEffects
  useEffect(() => {
    loadProduto();
    if (stateScreen === StateScreen.stUpdate || stateScreen === StateScreen.stView) {
      loadRecord(idSelected);
    } else if (stateScreen === StateScreen.stInsert) {
      const novo = new EntradaModel();

      setEntrada(novo);
    }
  }, [loadRecord, idSelected, stateScreen, loadProduto]);

  // render principal
  return (
    <div className="grid">
      <div className="col-6 sm:col-3 lg:col-2 p-fluid">
        <LabelTh>Data</LabelTh>
        <CalendarTh
          dateFormat="dd/mm/yy"
          readOnlyInput
          appendTo={document.body}
          disabled={viewMode()}
          required
          value={entrada.dataEntrada}
          onChange={(e: any) => setEntrada({ ...entrada, dataEntrada: e.value })}
        />
      </div>
      <div className="col-6 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Produto</LabelTh>
        <DropdownTh
          value={entrada.idProdutoServico}
          options={produtos}
          disabled={viewMode()}
          filterInputAutoFocus={false}
          required
          placeholder="Selecione"
          onChange={(e) => {
            setEntrada({ ...entrada, idProdutoServico: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-2 lg:col-2 p-fluid">
        <LabelTh>Valor Unit.</LabelTh>
        <InputCurrencyTh
          value={entrada.valorUnitario}
          digits={2}
          disabled={viewMode()}
          required
          onChangeNumber={(_e, n) => {
            const valorTotal = n * entrada.quantidade;
            setEntrada({ ...entrada, valorUnitario: n, valorTotal });
          }}
        />
      </div>

      <div className="col-6 sm:col-2 lg:col-2 p-fluid">
        <LabelTh>Quantidade</LabelTh>
        <InputCurrencyTh
          value={entrada.quantidade}
          digits={2}
          disabled={viewMode()}
          required
          onChangeNumber={(_e, n) => {
            const valorTotal = n * entrada.valorUnitario;
            setEntrada({ ...entrada, quantidade: n, valorTotal });
          }}
        />
      </div>

      <div className="col-6 sm:col-2 lg:col-2 p-fluid">
        <LabelTh>Valor Total</LabelTh>
        <InputCurrencyTh value={entrada.valorTotal} digits={2} disabled />
      </div>

      <div className="col-12 lg:col-12" style={{ textAlign: 'start' }}>
        {!viewMode() ? (
          <ButtonTh
            className="p-button-success"
            icon="pi pi-save"
            label="Salvar"
            disabled={
              !validateFields(entrada, ['dataEntrada', 'idProdutoServico', 'valorTotal'])
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
