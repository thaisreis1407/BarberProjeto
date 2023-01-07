import { Column } from 'primereact/column';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import BotaoMenuGrid from '../../components/BotaoMenuGrid';
import ButtonTh from '../../components/ButtonTh';
import CalendarTh from '../../components/CalendarTh';
import DataTableTh from '../../components/DataTableTh';
import DropdownTh from '../../components/DropdownTh';
import InputTextTh from '../../components/InputTextTh';
import LabelTh from '../../components/LabelTh';
import { showMessage } from '../../components/MessageDialog';
import { cfgPtBr } from '../../config/Constantes';
import AgendaService from '../../services/AgendaService';
import AtendenteService from '../../services/AtendenteService';
import AuthService from '../../services/AuthService';
import {
  calcNaxItemsPage,
  cloneObj,
  errorHandle,
  formatDate,
  newTimeOnly,
  validateFields,
} from '../../util/functions';
import { AgendaDetalheModel, AgendaModel, AtendenteModel } from '../../util/Models';
import { StateScreen } from '../constants';

interface IProps {
  stateScreen: string;
  idSelected: number;
  onClose: (ret?: any) => void;
}

interface IDropdownItems {
  value?: string;
  label: string;
}

export default function AgendaCrud(props: IProps) {
  const { stateScreen, idSelected, onClose } = props;

  // states
  const [agenda, setAgenda] = useState(new AgendaModel());
  const [agendaDetalhe, setAgendaDetalhe] = useState<AgendaDetalheModel[]>([]);
  const [atendentes, setAtendentes] = useState<IDropdownItems[]>([]);

  const [errorLoadRecord, setErrorLoadRecord] = useState(false);
  const [atendenteSelecionado, setAtendenteSelecionado] = useState<IDropdownItems>();

  const [horarioInicioSelecionada, setHoraInicioSelecionada] = useState(
    newTimeOnly('09:00:00')
  );
  const [horaFinalSelecionada, setHoraFinalSelecionada] = useState(newTimeOnly('19:00:00'));

  const [idxAgendaDetalheSelecionada, setIdxAgendaDetalheSelecionada] = useState<
    number | undefined
  >();
  const [diaSemanaSelecionado, setDiaSemanaSelecionado] = useState<number | undefined>();
  const [pageLimit] = useState(calcNaxItemsPage(5, 9, 14));

  const loadAtendente = useCallback(async () => {
    const r = await AtendenteService.consulta({ limit: 50 });

    const retorno = r.content.map((e: any) => {
      return {
        label: e.nome,
        value: e.id,
      };
    });

    setAtendentes(retorno);
  }, []);

  const diasSemana = [
    { label: 'Domingo', value: 0 },
    { label: 'Segunda', value: 1 },
    { label: 'Terça', value: 2 },
    { label: 'Quarta', value: 3 },
    { label: 'Quinta', value: 4 },
    { label: 'Sexta', value: 5 },
    { label: 'Sábado', value: 6 },
  ];

  // useCallbacks
  const loadRecord = useCallback(async (_id: number) => {
    try {
      const retorno: AgendaModel = await AgendaService.buscaPorId(_id);

      if (retorno.agendaDetalhe && Array.isArray(retorno.agendaDetalhe)) {
        retorno.agendaDetalhe.forEach((e: any) => {
          if (e.horarioInicio) {
            e.horarioInicio = new Date(`1970-01-01T${e.horarioInicio}.000Z`);
          }

          if (e.horarioFim) {
            e.horarioFim = new Date(`1970-01-01T${e.horarioFim}.000Z`);
          }
        });
      }

      if (!retorno.agendaDetalhe) {
        retorno.agendaDetalhe = [];
      }

      setAgenda(retorno);
      setAgendaDetalhe(retorno.agendaDetalhe);

      const atendente = {
        label: retorno.atendente.nome,
        value: retorno.atendente.id,
      };

      setAtendenteSelecionado(atendente);
      setErrorLoadRecord(false);
    } catch (err) {
      setErrorLoadRecord(true);
      errorHandle(err);
    }
  }, []);

  // funcoes
  function buscaNomeDiaSemana(nDia: number): string {
    switch (nDia) {
      case 0:
        return 'Domingo';
      case 1:
        return 'Segunda';
      case 2:
        return 'Terça';
      case 3:
        return 'Quarta';
      case 4:
        return 'Quinta';
      case 5:
        return 'Sexta';
      case 6:
        return 'Sabado';
      default:
        return '';
    }
  }

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
      let retorno;
      const configAgendaSalvar = cloneObj(agenda);

      configAgendaSalvar.agendaDetalhe = agendaDetalhe.map((ag) => {
        return {
          ...ag,
          horarioInicio: ag.horarioInicio.toISOString().substring(11, 19),
          horarioFim: ag.horarioFim.toISOString().substring(11, 19),
        };
      });

      if (stateScreen === StateScreen.stInsert) {
        retorno = await AgendaService.adicionar(configAgendaSalvar);
      } else {
        retorno = await AgendaService.atualizar(configAgendaSalvar);
      }
      toast.success('Registro salvo com sucesso.');
      onClose(retorno);
    } catch (err) {
      errorHandle(err);
    }
  }

  function validaHorarioDetalhe(agendaDetalheVerificar: AgendaDetalheModel) {
    let validou = true;

    agendaDetalhe.forEach((ag, index) => {
      if (index !== idxAgendaDetalheSelecionada) {
        if (agendaDetalheVerificar.diaSemana === ag.diaSemana) {
          if (
            ag.horarioInicio.getTime() >= agendaDetalheVerificar.horarioInicio.getTime() &&
            ag.horarioInicio.getTime() <= agendaDetalheVerificar.horarioFim.getTime()
          ) {
            validou = false;
          }
          if (
            ag.horarioFim.getTime() <= agendaDetalheVerificar.horarioFim.getTime() &&
            ag.horarioFim.getTime() >= agendaDetalheVerificar.horarioInicio.getTime()
          ) {
            validou = false;
          }

          if (
            agendaDetalheVerificar.horarioInicio.getTime() >= ag.horarioInicio.getTime() &&
            agendaDetalheVerificar.horarioInicio.getTime() <= ag.horarioFim.getTime()
          ) {
            validou = false;
          }

          if (
            agendaDetalheVerificar.horarioFim.getTime() <= ag.horarioFim.getTime() &&
            agendaDetalheVerificar.horarioFim.getTime() >= ag.horarioInicio.getTime()
          ) {
            validou = false;
          }
        }
      }
    });

    if (!validou) {
      toast.warn('Existe outro horário no mesmo intervalo.');
      return validou;
    }
    return validou;
  }

  const carregaDetalhe = (registro: AgendaDetalheModel) => {
    let idx;
    if (Array.isArray(agendaDetalhe)) {
      idx = agendaDetalhe.findIndex((e) => e === registro);
    }

    setDiaSemanaSelecionado(registro.diaSemana);
    setHoraFinalSelecionada(registro.horarioFim);
    setHoraInicioSelecionada(registro.horarioInicio);
    setIdxAgendaDetalheSelecionada(idx);
  };

  const confirmaExclusaoDetalhe = (registro: AgendaDetalheModel) => {
    showMessage('Confirmação', `Deseja excluir registro?`, (idx: number) => {
      if (idx === 1) {
        const agendaDetalhes = [...agendaDetalhe] || [];

        let indice;

        if (Array.isArray(agendaDetalhe)) {
          indice = agendaDetalhe.findIndex((e) => e === registro);
        }

        if (indice !== undefined && indice >= 0) {
          agendaDetalhes.splice(indice, 1);
          setAgendaDetalhe(agendaDetalhes);
        }
      }
    });
  };

  const salvarDetalhe = () => {
    let detalhe;
    const agendaDetalhes = [...agendaDetalhe];

    if (idxAgendaDetalheSelecionada !== undefined && idxAgendaDetalheSelecionada >= 0) {
      detalhe = agendaDetalhes[idxAgendaDetalheSelecionada];
      detalhe.diaSemana = diaSemanaSelecionado;
      detalhe.horarioInicio = horarioInicioSelecionada;
      detalhe.horarioFim = horaFinalSelecionada;
    } else {
      detalhe = new AgendaDetalheModel();

      detalhe.diaSemana = diaSemanaSelecionado;
      detalhe.horarioInicio = horarioInicioSelecionada;
      detalhe.horarioFim = horaFinalSelecionada;
      agendaDetalhes.push(detalhe);
    }

    if (detalhe && !validaHorarioDetalhe(detalhe)) {
      return;
    }

    setAgendaDetalhe(agendaDetalhes);
    setIdxAgendaDetalheSelecionada(undefined);
    setHoraInicioSelecionada(newTimeOnly('09:00:00'));
    setHoraFinalSelecionada(newTimeOnly('19:00:00'));
    setDiaSemanaSelecionado(undefined);
  };

  // useEffects
  useEffect(() => {
    loadAtendente();
    if (stateScreen === StateScreen.stUpdate || stateScreen === StateScreen.stView) {
      loadRecord(idSelected);
    } else if (stateScreen === StateScreen.stInsert) {
      const novo = new AgendaModel();

      setAgenda(novo);
    }
  }, [loadRecord, idSelected, stateScreen, loadAtendente]);

  // render principal
  return (
    <div className="grid">
      <div className="col-12 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Nome</LabelTh>
        <InputTextTh
          disabled={viewMode()}
          required
          maxLength={100}
          value={agenda.nome}
          onChange={(e) => setAgenda({ ...agenda, nome: e.target.value })}
        />
      </div>

      <div className="col-6 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Atendente</LabelTh>
        <DropdownTh
          value={agenda.idAtendente}
          options={atendentes}
          disabled={viewMode()}
          filterInputAutoFocus={false}
          required
          placeholder="Selecione"
          onChange={(e) => {
            setAgenda({ ...agenda, idAtendente: e.target.value });
          }}
        />
      </div>
      <div className="col-6 sm:col-4 lg:col-4 p-fluid">
        <LabelTh>Intervalo</LabelTh>
        <DropdownTh
          required
          disabled={viewMode()}
          placeholder="Selecione"
          value={agenda.intervaloMinutos}
          options={[
            { value: 15, label: '15 Minutos' },
            { value: 20, label: '20 Minutos' },
            { value: 30, label: '30 Minutos' },
            { value: 40, label: '40 Minutos' },
            { value: 45, label: '45 Minutos' },
            { value: 60, label: '60 Minutos' },
            { value: 90, label: '90 Minutos' },
          ]}
          onChange={(e) => setAgenda({ ...agenda, intervaloMinutos: e.target.value })}
        />
      </div>

      <div
        className="col-12 p-fluid"
        style={{ textAlign: 'center', marginTop: 0, marginBottom: 0 }}
      >
        <hr style={{ margin: 0, padding: 0 }} />
        <LabelTh>Horário</LabelTh>
      </div>
      <div className="col-12 sm:col-5 lg:col-4 p-fluid">
        <LabelTh>Dia da Semana</LabelTh>
        <DropdownTh
          required
          placeholder="Selecione"
          disabled={viewMode()}
          value={diaSemanaSelecionado}
          options={diasSemana}
          onChange={(e) => setDiaSemanaSelecionado(e.target.value)}
        />
      </div>
      <div className="col-4 sm:col-2 lg:col-2 p-fluid">
        <LabelTh>Hr Inicial</LabelTh>
        <CalendarTh
          readOnlyInput
          appendTo={document.body}
          showTime
          timeOnly
          disabled={viewMode()}
          required
          // locale={cfgPtBr}
          value={horarioInicioSelecionada}
          onChange={(e: any) => setHoraInicioSelecionada(e.value)}
        />
      </div>

      <div className="col-4 sm:col-2 lg:col-2 p-fluid">
        <LabelTh>Hr Final</LabelTh>
        <CalendarTh
          readOnlyInput
          appendTo={document.body}
          showTime
          timeOnly
          disabled={viewMode()}
          required
          locale="ptBr"
          value={horaFinalSelecionada}
          onChange={(e: any) => setHoraFinalSelecionada(e.value)}
        />
      </div>

      <div className="col-4 sm:col-4 lg:col-4">
        <LabelTh>&#160;</LabelTh>
        <ButtonTh
          className="p-button-success"
          icon="pi pi-save"
          title="Salvar"
          disabled={
            diaSemanaSelecionado === undefined ||
            !horaFinalSelecionada ||
            !horarioInicioSelecionada
          }
          onClick={() => salvarDetalhe()}
        />
        <ButtonTh
          className="p-button-danger"
          icon="pi pi-times"
          title="Cancelar"
          onClick={() => {
            setDiaSemanaSelecionado(undefined);
            setHoraInicioSelecionada(newTimeOnly('09:00:00'));
            setHoraFinalSelecionada(newTimeOnly('19:00:00'));
          }}
        />
      </div>

      <div className="col-12 p-fluid">
        <DataTableTh
          value={agendaDetalhe}
          style={{ marginBottom: '2px' }}
          paginator
          rows={pageLimit}
        >
          <Column
            className="grid-col"
            header="Dia da semana"
            body={(rowData) => buscaNomeDiaSemana(rowData.diaSemana)}
          />

          <Column
            className="grid-col-data"
            header="Hr. Inicio"
            body={(rowData) => formatDate(rowData.horarioInicio, 'HH:mm')}
          />

          <Column
            className="grid-col-data"
            header="Hr. Fim"
            body={(rowData) => formatDate(rowData.horarioFim, 'HH:mm')}
          />

          <Column
            className="gid-col-acoes-35"
            bodyStyle={{ textAlign: 'end' }}
            body={renderButtonOp}
          />
        </DataTableTh>
      </div>

      <div className="col-12 lg:col-12" style={{ textAlign: 'start' }}>
        {!viewMode() ? (
          <ButtonTh
            className="p-button-success"
            icon="pi pi-save"
            label="Salvar"
            disabled={
              !validateFields(agenda, ['nome', 'idAtendente', 'intervaloMinutos']) ||
              agendaDetalhe.length === 0
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

  function renderButtonOp(rowData: any) {
    return (
      <BotaoMenuGrid
        handles={[
          () => {
            carregaDetalhe(rowData);
          },
          () => {
            confirmaExclusaoDetalhe(rowData);
          },
        ]}
        labels={['Alterar', 'Excluir']}
        icons={['pi pi-pencil', 'pi pi-trash']}
        disableds={[
          !AuthService.checkRoles('ROLE_ALTERAR_AGENDA'),
          !AuthService.checkRoles('ROLE_EXCLUIR_AGENDA'),
        ]}
      />
    );
  }
}
