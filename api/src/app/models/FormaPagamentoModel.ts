import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ContaModel } from './ContaModel';

@Entity({ name: 'forma_pagamento' })
export class FormaPagamentoModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'descricao', nullable: false, length: 100 })
  descricao: string;
  @Column({ name: 'id_conta', nullable: false })
  idConta: number;
  @Column({ name: 'desagio', precision: 18, scale: 6 })
  desagio: number;
  @Column({ name: 'padrao', length: 5 })
  padrao: string;

  @ManyToOne(() => ContaModel, { eager: true })
  @JoinColumn({ name: 'id_conta' })
  conta: ContaModel;
}
