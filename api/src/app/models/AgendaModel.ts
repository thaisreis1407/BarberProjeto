import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AgendaDetalheModel } from './AgendaDetalheModel';
import { AtendenteModel } from './AtendenteModel';

@Entity({ name: 'agenda' })
export class AgendaModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'id_atendente' })
  idAtendente: number;
  @Column({ name: 'nome', nullable: false, length: 40 })
  nome: string;
  @Column({ name: 'intervalo_minutos', nullable: false })
  intervaloMinutos: number;

  @OneToMany(() => AgendaDetalheModel, (gendaDetalhe) => gendaDetalhe.agenda, {
    cascade: true,
    eager: true,
  })
  agendaDetalhe: AgendaDetalheModel[];

  @ManyToOne(() => AtendenteModel, { eager: true })
  @JoinColumn({ name: 'id_atendente' })
  atendente: AtendenteModel;
}
