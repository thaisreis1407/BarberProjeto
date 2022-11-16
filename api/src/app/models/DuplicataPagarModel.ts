import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DuplicataPagamentoModel } from './DuplicataPagamentoModel';
import { FornecedorModel } from './FornecedorModel';

@Entity({ name: 'duplicata_pagar' })
export class DuplicataPagarModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'data_compra', nullable: false, type: 'date' })
  dataCompra: Date;
  @Column({ name: 'data_vencimento', nullable: false, type: 'date' })
  dataVencimento: Date;
  @Column({ name: 'valor', nullable: false, precision: 18, scale: 6 })
  valor: number;
  @Column({ name: 'id_fornecedor', nullable: false })
  idFornecedor: number;
  @Column({ name: 'valor_recebido', precision: 18, scale: 6})
	valorRecebido: number ;
	@Column({ name: 'status'})
	status: number ;
	@Column({ name: 'observacao', type: 'text'})
	observacao: string ;

  @ManyToOne(() => FornecedorModel, { eager: true })
  @JoinColumn({ name: 'id_fornecedor' })
  fornecedor: FornecedorModel;

  @OneToMany(
    () => DuplicataPagamentoModel,
    (duplicataPagamento) => duplicataPagamento.duplicataPagar,
    {
      cascade: true,
      eager: true,
    }
  )
  duplicataPagamento: DuplicataPagamentoModel[];
}
