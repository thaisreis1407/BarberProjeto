import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AgendaModel } from './AgendaModel';

@Entity({ name: 'agenda_detalhe' })
export class AgendaDetalheModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'id_agenda', nullable: false })
  idAgenda: number;
  @Column({ name: 'dia_semana', nullable: false })
  diaSemana: number;
  @Column({ name: 'horario_inicio', nullable: false, type: 'time' })
  horarioInicio: Date;
  @Column({ name: 'horario_fim', nullable: false, type: 'time' })
  horarioFim: Date;

  @ManyToOne(() => AgendaModel, (agenda) => agenda.agendaDetalhe, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'id_agenda' })
  agenda: AgendaModel;
}
