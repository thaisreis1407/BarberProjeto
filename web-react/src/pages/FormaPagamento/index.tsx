import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import BotaoMenuGrid from '../../components/BotaoMenuGrid';
import DataTableTh from '../../components/DataTableTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import AuthService from '../../services/AuthService';
import FormaPagamentoService from '../../services/FormaPagamentoService';
import {
  getPageParams,
  errorHandle,
  padLeft,
  calcNaxItemsPage,
  isScreenMobile,
  formatFloat,
} from '../../util/functions';
import { StateScreen } from '../constants';
import FormaPagamentoCrud from './crud';
import { Container } from './styles';

export default function FormaPagamento() {
  // useMemo
  const domParams = useParams();
  const [domSearch] = useSearchParams();

  const pageParams = useMemo(
    () => getPageParams(domParams, domSearch),
    [domParams, domSearch]
  );

  const filterService = useMemo(() => FormaPagamentoService.getFilter(), []);

  // useStates
  const toBack = pageParams.toBack || '/formasPagamento';

  const [filter, setFilter] = useState(filterService);
  const [formasPagamento, setFormasPagamento] = useState([]);

  const [pageLimit, setPageLimit] = useState<number>(filterService.size);
  const [first, setFirst] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSelected, setPageSelected] = useState(0);
  const [funcTimeOut, setFuncTimeOut] = useState<NodeJS.Timeout>();

  const navigation = useNavigate();

  // useCallbacks
  const calcLimit = useCallback(() => {
    const ret = calcNaxItemsPage(7, 12, 19);

    setPageLimit(ret);
    return ret;
  }, []);

  const handleBuscar = useCallback(
    async (_filter: any, _page = 0, resetPage = true) => {
      _filter.page = _page || 0;
      _filter.size = calcLimit();
      try {
        const result = await FormaPagamentoService.consulta(_filter);

        setFormasPagamento(result.content);
        setTotalRecords(result.totalElements);
        if (resetPage) {
          setFirst(0);
        }
      } catch (err) {
        errorHandle(err);
      }
    },
    [calcLimit]
  );

  const setFilterAndSearch = useCallback(
    async (_filterValue: any) => {
      if (JSON.stringify(_filterValue) !== JSON.stringify(filter)) {
        setFilter(_filterValue);

        if (funcTimeOut) {
          clearTimeout(funcTimeOut);
        }
        const func = setTimeout(async () => {
          handleBuscar(_filterValue);
        }, 800);
        setFuncTimeOut(func);
      }
    },
    [filter, funcTimeOut, handleBuscar]
  );

  function onPage(event: any) {
    const pagina = event.first / event.rows;
    setPageSelected(pagina);
    setFirst(event.first);
    handleBuscar(filter, pagina, false);
  }

  // useCallbacks
  const excluirRegistro = useCallback(
    async (_id: number) => {
      try {
        await FormaPagamentoService.delete(_id);
        toast.success('Registro excluído com sucesso.');
        handleBuscar(filter);
      } catch (err) {
        errorHandle(err);
      }
    },
    [filter, handleBuscar]
  );

  // functions
  function getTitle() {
    const titleDefault = 'FormaPagamento';
    let titleAdd = '';

    if (pageParams.stateScreen === StateScreen.stSearch) {
      titleAdd = '';
    }
    if (pageParams.stateScreen === StateScreen.stInsert) {
      titleAdd = '(Novo)';
    }
    if (pageParams.stateScreen === StateScreen.stUpdate) {
      titleAdd = `(Alterando Id: ${pageParams.idSelected})`;
    }
    if (pageParams.stateScreen === StateScreen.stView) {
      titleAdd = ` (Visualizando Id: ${pageParams.idSelected})`;
    }

    if (!isScreenMobile()) {
      return `${titleDefault} ${titleAdd}`;
    }

    return titleDefault;
  }

  const confirmaExclusao = useCallback(
    (id: any) => {
      showMessage('Confirmação', 'Confirma a exclusão do registro?', (idx: any) => {
        if (idx === 1) {
          excluirRegistro(id);
        }
      });
    },
    [excluirRegistro]
  );

  // useEffects
  useEffect(() => {
    if (pageParams.stateScreen === StateScreen.stSearch) {
      handleBuscar(filter, 0, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffects
  useEffect(() => {
    if (pageParams.stateScreen === StateScreen.stSearch) {
      calcLimit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calcLimit]);

  // renders
  return (
    <Container className="container-page">
      <div className="grid" style={{ marginBottom: 10 }}>
        <h2>{getTitle()}</h2>
      </div>
      {pageParams.stateScreen === StateScreen.stSearch ? renderSearch() : renderCrud()}
    </Container>
  );

  function renderSearch() {
    return (
      <div className="grid">
        <div className="col-12 sm:col-6 lg:col-6 p-fluid">
          <LabelTh>Descrição</LabelTh>
          <InputTextTh
            value={filter.descricao}
            maxLength={100}
            onChange={(e) => {
              setFilterAndSearch({ ...filter, descricao: e.target.value });
            }}
          />
        </div>

        <div className="col-12 sm:col-6 lg:col-6">
          <LabelTh className="label-button">&nbsp;</LabelTh>
          <Button
            className="buttons p-button-secondary"
            title="Buscar"
            label="Buscar"
            icon="pi pi-search"
            type="button"
            onClick={() => {
              handleBuscar(filter);
            }}
          />
          <Button
            className="buttons"
            title="Inserir"
            label="Inserir"
            icon="pi pi-plus-circle"
            type="button"
            onClick={() => {
              navigation('/formasPagamento/insert');
            }}
            disabled={!AuthService.checkRoles('ROLE_INSERIR_FORMA_PAGAMENTO')}
          />
        </div>

        <div className="col-12 p-fluid">
          <DataTableTh
            value={formasPagamento}
            style={{ marginBottom: '2px' }}
            paginator
            rows={pageLimit}
            lazy
            totalRecords={totalRecords}
            first={first}
            onPage={(event: any) => onPage(event)}
          >
            <Column
              field="id"
              body={(rowData) => padLeft(rowData.id, 6)}
              header="Id"
              className="grid-col-id"
            />
            <Column field="descricao" className="grid-col" header="Descrição" />
            <Column
              field="responsavel"
              className="grid-col"
              header="Conta"
              body={(rowData) => rowData.conta?.descricao}
            />
            <Column
              field="desagio"
              className="grid-col grid-col-val"
              header="Deságio"
              body={(rowData) => formatFloat(rowData.desagio, 2)}
            />

            <Column
              className="grid-col grid-col-center p-p-5"
              style={{ width: 80 }}
              header="Padrão"
              body={(rowData) => (rowData.padrao === true ? 'Sim' : 'Não')}
            />
            <Column
              className="gid-col-acoes-35"
              bodyStyle={{ textAlign: 'end' }}
              body={renderButtonOp}
            />
          </DataTableTh>
        </div>
      </div>
    );
  }

  function renderButtonOp(rowData: any) {
    return (
      <BotaoMenuGrid
        handles={[
          () => navigation(`/formasPagamento/${rowData.id}?view`),
          () => navigation(`/formasPagamento/${rowData.id}`),
          () => confirmaExclusao(rowData.id),
        ]}
        disableds={[
          false,
          !AuthService.checkRoles('ROLE_ALTERAR_FORMA_PAGAMENTO'),
          !AuthService.checkRoles('ROLE_EXCLUIR_FORMA_PAGAMENTO'),
        ]}
      />
    );
  }

  function renderCrud() {
    return (
      <FormaPagamentoCrud
        idSelected={pageParams.idSelected}
        stateScreen={pageParams.stateScreen}
        onClose={() => {
          navigation(toBack);
          handleBuscar(filter, pageSelected, false);
        }}
      />
    );
  }
}
