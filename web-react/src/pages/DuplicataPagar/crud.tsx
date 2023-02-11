import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import ButtonTh from '../../components/ButtonTh';
import CalendarTh from '../../components/CalendarTh';
import DataTableTh from '../../components/DataTableTh';
import DropdownTh from '../../components/DropdownTh';
import InputCurrencyTh from '../../components/InputCurrencyTh';
import InputTextareaTh from '../../components/InputTextareaTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import AuthService from '../../services/AuthService';
import DuplicataPagarService from '../../services/DuplicataPagarService';
import FornecedorService from '../../services/FornecedorService';
import {
  cloneObj,
  errorHandle,
  formatDate,
  formatFloat,
  padLeft,
  strToDate,
  validateFields,
} from '../../util/functions';
import { DuplicataPagarModel } from '../../util/Models';
import Quitacao from '../components/Quitacao';
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

export default function DuplicataPagarCrud(props: IProps) {
  const { stateScreen, idSelected, onClose } = props;

  // states
  const [duplicataPagar, setDuplicataPagar] = useState(new DuplicataPagarModel());
  const [errorLoadRecord, setErrorLoadRecord] = useState(false);
  const [fornecedores, setFornecedores] = useState<IDropdownItems[]>([]);
  const [showQuitacao, setShowQuitacao] = useState(false);

  // useCallbacks
  const loadRecord = useCallback(async (_id: number) => {
    try {
      const retorno = await DuplicataPagarService.buscaPorId(_id);
      retorno.dataCompra = strToDate(retorno.dataCompra);
      retorno.dataVencimento = strToDate(retorno.dataVencimento);
      setDuplicataPagar(retorno);
      setErrorLoadRecord(false);
    } catch (err) {
      setErrorLoadRecord(true);
      errorHandle(err);
    }
  }, []);

  const loadFornecedores = useCallback(async () => {
    const r = await FornecedorService.consulta({ limit: 999999 });

    const retorno = r.content.map((e: any) => {
      return {
        label: e.nome,
        value: e.id,
      };
    });
    setFornecedores(retorno);
  }, []);

  // funcoes
  function viewMode() {
    return stateScreen === StateScreen.stView || errorLoadRecord;
  }

  function buscaNomeStatus(status: number): string {
    switch (status) {
      case 0:
        return 'Aberto';
      case 1:
        return 'Parcial';
      default:
        return 'Quitado';
    }
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

  function handleEstornar(id: number) {
    showMessage('Confirmação', 'Deseja estornar quitação?', async (idx: number) => {
      if (idx === 1) {
        await DuplicataPagarService.estornar(id);
        loadRecord(idSelected);
      }
    });
  }

  async function salvarRecord() {
    try {
      let retorno: any;
      const duplicataPagarSalvar = cloneObj(duplicataPagar);
      duplicataPagarSalvar.fornecedor = {
        id: duplicataPagarSalvar.idFornecedor,
      };

      if (stateScreen === StateScreen.stInsert) {
        retorno = await DuplicataPagarService.adicionar(duplicataPagarSalvar);
      } else {
        retorno = await DuplicataPagarService.atualizar(duplicataPagarSalvar);
      }
      toast.success('Registro salvo com sucesso.');
      onClose(retorno);
    } catch (err) {
      errorHandle(err);
    }
  }

  async function gerarQuitacao(camposQuitacao: any) {
    const duplicataPagamento = {
      idConta: camposQuitacao.idConta,
      dataPagamento: camposQuitacao.dataQuitacao,
      valor: camposQuitacao.valor,
      observacao: camposQuitacao.observacao,
    };

    if (duplicataPagar.id) {
      await DuplicataPagarService.quitar(duplicataPagar.id, duplicataPagamento);
      loadRecord(idSelected);
    }
  }

  // useEffects
  useEffect(() => {
    loadFornecedores();
    if (stateScreen === StateScreen.stUpdate || stateScreen === StateScreen.stView) {
      loadRecord(idSelected);
    } else if (stateScreen === StateScreen.stInsert) {
      const novo = new DuplicataPagarModel();
      setDuplicataPagar(novo);
    }
  }, [loadRecord, idSelected, stateScreen, loadFornecedores]);

  // render principal
  return (
    <div className="grid">
      {showQuitacao ? (
        <Quitacao
          visible={showQuitacao}
          setVisible={setShowQuitacao}
          valorRestante={duplicataPagar.valor - duplicataPagar.valorRecebido}
          dataCompra={duplicataPagar.dataCompra}
          onConfirm={(camposQuitacao) => {
            gerarQuitacao(camposQuitacao);
          }}
        />
      ) : null}

      <div className="col-6 sm:col-4 lg:col-3 p-fluid">
        <LabelTh>Data Compra</LabelTh>
        <CalendarTh
          readOnlyInput
          appendTo={document.body}
          dateFormat="dd/mm/yy"
          yearNavigator
          disabled={viewMode() || duplicataPagar.status !== 0}
          required
          value={duplicataPagar.dataCompra}
          yearRange="2010:2040"
          onChange={(e: any) => {
            setDuplicataPagar({ ...duplicataPagar, dataCompra: e.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-4 lg:col-3 p-fluid">
        <LabelTh>Data Vencimento</LabelTh>
        <CalendarTh
          readOnlyInput
          appendTo={document.body}
          dateFormat="dd/mm/yy"
          yearNavigator
          disabled={viewMode() || duplicataPagar.status !== 0}
          required
          value={duplicataPagar.dataVencimento}
          yearRange="2010:2040"
          onChange={(e: any) => {
            setDuplicataPagar({ ...duplicataPagar, dataVencimento: e.value });
          }}
        />
      </div>

      <div className="col-12 sm:col-4 lg:col-6 p-fluid">
        <LabelTh>Fornecedor</LabelTh>
        <DropdownTh
          value={duplicataPagar.idFornecedor}
          options={fornecedores}
          disabled={viewMode() || duplicataPagar.status !== 0}
          filterInputAutoFocus={false}
          required
          placeholder="Selecione"
          onChange={(e) => {
            setDuplicataPagar({ ...duplicataPagar, idFornecedor: e.target.value });
          }}
        />
      </div>

      <div className="col-6 sm:col-3 lg:col-3 p-fluid">
        <LabelTh>Status</LabelTh>
        <InputTextTh value={buscaNomeStatus(duplicataPagar.status)} disabled />
      </div>

      <div className="col-6 sm:col-3 lg:col-3 p-fluid">
        <LabelTh>Valor</LabelTh>
        <InputCurrencyTh
          value={duplicataPagar.valor}
          digits={2}
          disabled={viewMode() || duplicataPagar.status !== 0}
          required
          onChangeNumber={(_e, n) => {
            setDuplicataPagar({ ...duplicataPagar, valor: n });
          }}
        />
      </div>

      <div className="col-6 sm:col-3 lg:col-3 p-fluid">
        <LabelTh>Valor Recebido</LabelTh>
        <InputCurrencyTh value={duplicataPagar.valorRecebido} digits={2} disabled required />
      </div>

      <div className="col-6 sm:col-3 lg:col-3 p-fluid">
        <LabelTh>Valor Restante</LabelTh>
        <InputCurrencyTh
          value={duplicataPagar.valor - duplicataPagar.valorRecebido}
          digits={2}
          disabled
          required
        />
      </div>

      <div className="col-12 sm:col-12 lg:col-12 p-fluid">
        <LabelTh>Observacão</LabelTh>
        <InputTextareaTh
          value={duplicataPagar.observacao}
          disabled={viewMode() || duplicataPagar.status !== 0}
          onChange={(e: any) => {
            setDuplicataPagar({ ...duplicataPagar, observacao: e.target.value });
          }}
        />
      </div>

      {viewMode() ? renderQuitacao() : null}

      <div className="col-12 lg:col-12" style={{ textAlign: 'start' }}>
        {!viewMode() ? (
          <ButtonTh
            className="p-button-success"
            icon="pi pi-save"
            label="Salvar"
            disabled={
              !validateFields(duplicataPagar, [
                'dataCompra',
                'dataVencimento',
                'idFornecedor',
                'valor',
              ])
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

  function renderQuitacao() {
    return (
      <>
        <div
          className="col-12 p-fluid"
          style={{ textAlign: 'center', marginTop: 0, marginBottom: 0 }}
        >
          <hr style={{ margin: 0, padding: 0 }} />
          <LabelTh>Quitações</LabelTh>
        </div>

        <div className="col-12 sm:col-6 lg:col-6">
          <Button
            className="buttons"
            title="Inserir Quitação"
            label="Inserir Quitação"
            icon="pi pi-plus-circle"
            type="button"
            onClick={() => {
              setShowQuitacao(true);
            }}
            disabled={!AuthService.checkRoles('ROLE_ALTERAR_DUPLICATA_PAGAR')}
          />
        </div>

        <div className="col-12 p-fluid">
          <DataTableTh
            value={duplicataPagar.duplicataPagamento}
            style={{ marginBottom: '2px' }}
            paginator
            rows={5}
          >
            <Column
              field="id"
              body={(rowData) => padLeft(rowData.id, 6)}
              header="Id"
              className="grid-col-id"
            />
            <Column
              field="dataCompra"
              className="grid-col grid-col-data-hora"
              header="Dt. Compra"
              body={(rowData) => formatDate(rowData.dataPagamento, 'dd/MM/yyyy')}
            />
            <Column field="conta.descricao" className="grid-col" header="Conta" />
            <Column
              field="valor"
              className="grid-col grid-col-curr"
              header="Valor"
              body={(rowData) => formatFloat(rowData.valor, 2)}
            />
            <Column
              className="gid-col-acoes-35"
              bodyStyle={{ textAlign: 'end' }}
              // body={renderButtonOp}
              body={(rowData) => (
                <Button
                  type="button"
                  title="Estornar"
                  className="botao-pequeno p-button-danger"
                  icon="pi pi-trash"
                  onClick={() => handleEstornar(rowData.id)}
                />
              )}
            />
          </DataTableTh>
        </div>
      </>
    );
  }
}
