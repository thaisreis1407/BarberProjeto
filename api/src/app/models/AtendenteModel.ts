import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ContaModel } from './ContaModel';

@Entity({ name: 'atendente' })
export class AtendenteModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'nome', nullable: false, length: 100 })
  nome: string;
  @Column({ name: 'id_conta_comissao', nullable: false })
  idContaComissao: number;
  @Column({ name: 'inativo', nullable: false, length: 5 })
  inativo: string;

  @ManyToOne(() => ContaModel, { eager: true })
  @JoinColumn({ name: 'id_conta_comissao' })
  conta: ContaModel;
}
