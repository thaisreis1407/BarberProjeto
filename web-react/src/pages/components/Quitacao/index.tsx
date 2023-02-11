import { Dialog } from 'primereact/dialog';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ButtonTh from '../../../components/ButtonTh';
import CalendarTh from '../../../components/CalendarTh';
import DropdownTh from '../../../components/DropdownTh';
import InputCurrencyTh from '../../../components/InputCurrencyTh';
import InputTextareaTh from '../../../components/InputTextareaTh';
import LabelTh from '../../../components/LabelTh';
import ContaService from '../../../services/ContaService';
import { Container } from './styles';

interface IProps {
  dataCompra: Date;
  valorRestante: number;
  visible: boolean;
  setVisible: (value: boolean) => void;
  onConfirm: (camposQuitacao: ICamposQuitacao) => void;
}

interface ICamposQuitacao {
  dataQuitacao: Date;
  valor: number;
  idConta?: number;
  observacao: string;
}

interface IDropdownItems {
  value: string;
  label: string;
}

export default function Quitacao(props: IProps) {
  const { valorRestante, dataCompra, visible, setVisible, onConfirm } = props;

  const [camposQuitacao, setCamposQuitacao] = useState<ICamposQuitacao>({
    dataQuitacao: new Date(),
    idConta: undefined,
    valor: valorRestante,
    observacao: '',
  });

  const [contas, setContas] = useState<IDropdownItems[]>([]);

  const loadContas = useCallback(async () => {
    const r = await ContaService.consulta({ limit: 999999 });

    const retorno = r.content.map((e: any) => {
      return {
        label: e.descricao,
        value: e.id,
      };
    });
    setContas(retorno);
  }, []);

  useEffect(() => {
    loadContas();
  }, [loadContas]);

  // functions
  function validarConfirmar() {
    if (!camposQuitacao.dataQuitacao) {
      toast.warn('Informe a data de quitação.');
      return;
    }

    if (camposQuitacao.dataQuitacao < dataCompra) {
      toast.warn('Data de quitação deve ser maior ou igual à data da compra.');
      return;
    }

    if (!camposQuitacao.valor) {
      toast.warn('Informe o valor.');
      return;
    }

    if (camposQuitacao.valor > valorRestante) {
      toast.warn('Informe o valor não pode ser maior que o valor restante.');
      return;
    }

    if (!camposQuitacao.idConta) {
      toast.warn('Informe a conta.');
      return;
    }

    onConfirm(camposQuitacao);
    setVisible(false);
  }

  const footer = (
    <div>
      <ButtonTh
        autoFocus
        label="Confirmar"
        icon="pi pi-check"
        onClick={() => {
          validarConfirmar();
        }}
        className="p-button-success"
      />
      <ButtonTh
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => {
          setVisible(false);
        }}
        className="p-button-danger"
      />
    </div>
  );

  return (
    <Container>
      <Dialog
        closable
        footer={footer}
        header="Quitação"
        visible={visible}
        style={{ minWidth: '350px', maxWidth: '750px', width: '95%' }}
        modal
        onHide={() => {
          setVisible(false);
        }}
      >
        <div className="grid" style={{ margin: 0, padding: 0 }}>
          <div className="col-6 sm:col-3 lg:col-3 p-fluid">
            <LabelTh>Data Quitação</LabelTh>
            <CalendarTh
              readOnlyInput
              appendTo={document.body}
              dateFormat="dd/mm/yy"
              yearNavigator
              required
              value={camposQuitacao.dataQuitacao}
              yearRange="2010:2040"
              onChange={(e: any) => {
                setCamposQuitacao({ ...camposQuitacao, dataQuitacao: e.value });
              }}
            />
          </div>

          <div className="col-6 sm:col-3 lg:col-3 p-fluid">
            <LabelTh>Valor</LabelTh>
            <InputCurrencyTh
              digits={2}
              required
              value={camposQuitacao.valor}
              onChangeNumber={(_e, n) => {
                setCamposQuitacao({ ...camposQuitacao, valor: n });
              }}
            />
          </div>
          <div className="col-12 sm:col-6 lg:col-6 p-fluid">
            <LabelTh>Conta</LabelTh>
            <DropdownTh
              options={contas}
              filterInputAutoFocus={false}
              required
              placeholder="Selecione"
              value={camposQuitacao.idConta}
              onChange={(e) => {
                setCamposQuitacao({ ...camposQuitacao, idConta: e.value });
              }}
            />
          </div>
          <div className="col-12 sm:col-12 lg:col-12 p-fluid">
            <LabelTh>Observacão</LabelTh>
            <InputTextareaTh
              resize={false}
              value={camposQuitacao.observacao}
              onChange={(e) => {
                setCamposQuitacao({ ...camposQuitacao, observacao: e.target.value });
              }}
            />
          </div>
        </div>
      </Dialog>
    </Container>
  );
}
