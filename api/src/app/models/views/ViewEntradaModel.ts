import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'view_entrada' })
export class ViewEntradaModel extends BaseEntity {
  @PrimaryColumn()
  id: number;
  @Column({ name: 'id_produto_servico' })
  idProdutoServico: number;
  @Column({ name: 'valor_unitario', precision: 18, scale: 6 })
  valorUnitario: number;
  @Column({ name: 'data_entrada', type: 'date' })
  dataEntrada: Date;
  @Column({ name: 'valor_total', precision: 18, scale: 6 })
  valorTotal: number;
  @Column({ name: 'quantidade', precision: 18, scale: 6 })
  quantidade: number;
  @Column({ name: 'descricao', length: 100 })
  descricao: string;
}
