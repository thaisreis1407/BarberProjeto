import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'view_forma_pagamento' })
export class ViewFormaPagamentoModel extends BaseEntity {
  @PrimaryColumn()
  id: number;
  @Column({ name: 'id_conta' })
  idConta: number;
  @Column({ name: 'descricao', length: 100 })
  descricao: string;
  @Column({ name: 'descricao_conta', length: 100 })
  descricaoConta: string;
  @Column({ name: 'desagio', precision: 18, scale: 6 })
  desagio: number;
  @Column({ name: 'padrao'})
  padrao: boolean;
}
