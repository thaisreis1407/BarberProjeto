import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ContaModel } from './ContaModel';

@Entity({ name: 'movimentacao_conta' })
export class MovimentacaoContaModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'id_conta', nullable: false })
  idConta: number;
  @Column({ name: 'tipo', nullable: false, length: 1 })
  tipo: string;
  @Column({ name: 'data_movimentacao', nullable: false, type: 'date' })
  dataMovimentacao: Date;
  @Column({ name: 'valor', nullable: false, precision: 18, scale: 6 })
  valor: number;
  @Column({ name: 'descricao', length: 100 })
  descricao: string;
  @Column({ name: 'id_atendimento', nullable: true })
  idAtendimento: number;

  @ManyToOne(() => ContaModel, { eager: true })
  @JoinColumn({ name: 'id_conta' })
  conta: ContaModel;
}
