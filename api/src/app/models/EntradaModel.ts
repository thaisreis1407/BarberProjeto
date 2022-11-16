import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProdutoServicoModel } from './ProdutoServicoModel';

@Entity({ name: 'entrada' })
export class EntradaModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'id_produto_servico', nullable: false })
  idProdutoServico: number;
  @Column({ name: 'valor_unitario', nullable: false, precision: 18, scale: 6 })
  valorUnitario: number;
  @Column({ name: 'data_entrada', nullable: false, type: 'date' })
  dataEntrada: Date;
  @Column({ name: 'valor_total', nullable: false, precision: 18, scale: 6 })
  valorTotal: number;
  @Column({ name: 'quantidade', nullable: false, precision: 18, scale: 6 })
  quantidade: number;

  @ManyToOne(() => ProdutoServicoModel, { eager: true })
  @JoinColumn({ name: 'id_produto_servico' })
  produtoServico: ProdutoServicoModel;
}
