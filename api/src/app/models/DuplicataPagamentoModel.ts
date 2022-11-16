import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ContaModel } from './ContaModel';
import { DuplicataPagarModel } from './DuplicataPagarModel';



@Entity({name: 'duplicata_pagamento'})
export class DuplicataPagamentoModel extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number ;
	@Column({ name: 'id_duplicata_pagar', nullable: false})
	idDuplicataPagar: number ;
	@Column({ name: 'id_conta', nullable: false})
	idConta: number ;
  @Column({ name: 'id_movimentacao_conta', nullable: false})
  idMovimentacaoConta: number ;
	@Column({ name: 'data_pagamento', nullable: false, type: 'date'})
	dataPagamento: Date ;
	@Column({ name: 'valor', nullable: false, precision: 18, scale: 6})
	valor: number ;
	@Column({ name: 'observacao', type: 'text'})
	observacao: string ;

  @ManyToOne(() => ContaModel, { eager: true })
  @JoinColumn({ name: 'id_conta' })
  fornecedor: ContaModel;

  @ManyToOne(() => DuplicataPagarModel, (duplicataPagar) => duplicataPagar.duplicataPagamento, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'id_duplicata_pagar' })
  duplicataPagar: DuplicataPagarModel;
}
