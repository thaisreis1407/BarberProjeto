import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AgendamentoModel } from './AgendamentoModel';
import { AtendimentoDetalheModel } from './AtendimentoDetalheModel';
import { FormaPagamentoModel } from './FormaPagamentoModel';

@Entity({ name: 'atendimento' })
export class AtendimentoModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'id_agendamento', nullable: false })
  idAgendamento: number;
  @Column({ name: 'id_forma_pagamento' })
  idFormaPagamento: number;
  @Column({ name: 'data_inicio', nullable: false, type: 'date' })
  dataInicio: Date;
  @Column({ name: 'hora_inicio', nullable: false, type: 'time' })
  horaInicio: Date;
  @Column({ name: 'data_fim', type: 'date' })
  dataFim: Date;
  @Column({ name: 'hora_fim', type: 'time' })
  horaFim: Date;
  @Column({ name: 'valor_total', nullable: false, precision: 18, scale: 6 })
  valorTotal: number;
  @Column({ name: 'obs', length: 200 })
  obs: string;

  @ManyToOne(() => FormaPagamentoModel, { eager: true })
  @JoinColumn({ name: 'id_forma_pagamento' })
  formaPagamento: FormaPagamentoModel;

  @OneToMany(
    () => AtendimentoDetalheModel,
    (atendimentoDetalhe) => atendimentoDetalhe.atendimento,
    {
      cascade: true,
      eager: true,
    }
  )
  atendimentoDetalhe: AtendimentoDetalheModel[];

  @OneToOne(() => AgendamentoModel, (agendamento) => agendamento.atendimento, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'id_agendamento' })
  agendamento: AgendamentoModel;
}
