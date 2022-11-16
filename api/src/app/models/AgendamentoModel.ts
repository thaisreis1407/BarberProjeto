import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AtendenteModel } from './AtendenteModel';
import { AtendimentoModel } from './AtendimentoModel';
import { ClienteModel } from './ClienteModel';

@Entity({ name: 'agendamento' })
export class AgendamentoModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'id_agenda' })
  idAgenda: number;
  @Column({ name: 'id_cliente', nullable: false })
  idCliente: number;
  @Column({ name: 'id_atendente' })
  idAtendente: number;
  @Column({ name: 'data', nullable: false, type: 'date' })
  data: Date;
  @Column({ name: 'hora', nullable: false, type: 'time' })
  hora: Date;
  @Column({ name: 'observacao', type: 'text' })
  observacao: string;
  @Column({ name: 'status', nullable: false, length: 1 })
  status: string;

  @ManyToOne(() => ClienteModel, { eager: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: ClienteModel;

  @ManyToOne(() => AtendenteModel, { eager: true })
  @JoinColumn({ name: 'id_atendente' })
  atendente: AtendenteModel;

  // @OneToOne(() => AtendimentoModel, { eager: false, nullable: true })
  // @JoinColumn({ name: 'id', referencedColumnName: 'idAgendamento' })
  // atendimento?: AtendimentoModel;

  @OneToOne(() => AtendimentoModel, (atendimento) => atendimento.agendamento, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  atendimento?: AtendimentoModel;
}
