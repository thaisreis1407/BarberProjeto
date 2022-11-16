import AgendaDiaDetalhe from './AgendaDiaDetalhe';

export default class AgendaDia {
  idAgenda: number;
  idAtendente: number;
  nomeAgenda: string;
  agendaDiaDetalhe: AgendaDiaDetalhe[] = [];
}
