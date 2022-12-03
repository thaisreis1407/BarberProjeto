import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import BotaoMenuGrid from '../../components/BotaoMenuGrid';
import CalendarTh from '../../components/CalendarTh';
import DataTableTh from '../../components/DataTableTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import { cfgPtBr } from '../../config/Constantes';
import AuthService from '../../services/AuthService';
import DuplicataPagarService from '../../services/DuplicataPagarService';
import {
  getPageParams,
  errorHandle,
  padLeft,
  calcNaxItemsPage,
  isScreenMobile,
  formatFloat,
  formatDate,
} from '../../util/functions';
import { StateScreen, StatusDupl } from '../constants';
import DuplicataPagarCrud from './crud';
import { Container } from './styles';

export default function DuplicataPagar() {
  // useMemo
  const domParams = useParams();
  const [domSearch] = useSearchParams();

  const pageParams = useMemo(
    () => getPageParams(domParams, domSearch),
    [domParams, domSearch]
  );

  const filterService = useMemo(() => DuplicataPagarService.getFilter(), []);

  // useStates
  const toBack = pageParams.toBack || '/duplicatasPagar';

  const [filter, setFilter] = useState(filterService);
  const [duplicatasPagar, setDuplicatasPagar] = useState([]);

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
        const result = await DuplicataPagarService.consulta(_filter);

        setDuplicatasPagar(result.content);
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
        await DuplicataPagarService.delete(_id);
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
    const titleDefault = 'Duplicata Pagar';
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
          <LabelTh>Data Inicio</LabelTh>
          <CalendarTh
            readOnlyInput
            appendTo={document.body}
            dateFormat="dd/mm/yy"
            yearNavigator
            // locale={cfgPtBr}
            id="dataInicial"
            value={filter.dataInicio}
            yearRange="2010:2040"
            onChange={(e: any) => {
              setFilterAndSearch({ ...filter, dataInicio: e.value });
            }}
          />
        </div>

        <div className="col-12 sm:col-6 lg:col-6 p-fluid">
          <LabelTh>Data Fim</LabelTh>
          <CalendarTh
            readOnlyInput
            appendTo={document.body}
            dateFormat="dd/mm/yy"
            yearNavigator
            // locale={cfgPtBr}
            id="dataInicial"
            value={filter.dataFim}
            yearRange="2010:2040"
            onChange={(e: any) => {
              setFilterAndSearch({ ...filter, dataFim: e.value });
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
              navigation('/duplicatasPagar/insert');
            }}
            disabled={!AuthService.checkRoles('ROLE_INSERIR_DUPLICATA_PAGAR')}
          />
        </div>

        <div className="col-12 p-fluid">
          <DataTableTh
            value={duplicatasPagar}
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
            <Column
              field="dataCompra"
              className="grid-col grid-col-data-hora"
              header="Dt. Compra"
              body={(rowData) => formatDate(rowData.dataCompra, 'dd/MM/yyyy')}
            />
            <Column
              field="dataVencimento"
              className="grid-col grid-col-data"
              header="Vencimento"
              body={(rowData) => formatDate(rowData.dataVencimento, 'dd/MM/yyyy')}
            />

            <Column
              field="status"
              className="grid-col grid-col-data grid-col-center"
              header="Status"
              body={(rowData) => {
                if (rowData.status === StatusDupl.ABERTO) {
                  return <span style={{ color: 'red' }}>Aberto</span>;
                }
                if (rowData.status === StatusDupl.PARCIAL) {
                  return <span style={{ color: 'yellow' }}>Parcial</span>;
                }
                return <span style={{ color: 'blue' }}>Quitada</span>;
              }}
            />
            <Column field="nomeFornecedor" className="grid-col" header="Fornecedor" />
            <Column
              field="valor"
              className="grid-col grid-col-curr"
              header="Valor"
              body={(rowData) => formatFloat(rowData.valor, 2)}
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
          () => navigation(`/duplicatasPagar/${rowData.id}?view`),
          () => navigation(`/duplicatasPagar/${rowData.id}`),
          () => confirmaExclusao(rowData.id),
        ]}
        disableds={[
          false,
          !AuthService.checkRoles('ROLE_ALTERAR_DUPLICATA_PAGAR'),
          !AuthService.checkRoles('ROLE_EXCLUIR_DUPLICATA_PAGAR'),
        ]}
      />
    );
  }

  function renderCrud() {
    return (
      <DuplicataPagarCrud
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
