import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AtendimentoModel } from './AtendimentoModel';
import { ProdutoServicoModel } from './ProdutoServicoModel';

@Entity({ name: 'atendimento_detalhe' })
export class AtendimentoDetalheModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'id_atendimento', nullable: false })
  idAtendimento: number;
  @Column({ name: 'id_produto_servico', nullable: false })
  idProdutoServico: number;
  @Column({ name: 'tipo_produto_servico', nullable: false })
  tipoProdutoServico: number;
  @Column({ name: 'quantidade', nullable: false, precision: 18, scale: 6 })
  quantidade: number;
  @Column({ name: 'valor_unitario', nullable: false, precision: 18, scale: 6 })
  valorUnitario: number;
  @Column({ name: 'valor_total', nullable: false, precision: 18, scale: 6 })
  valorTotal: number;

  @ManyToOne(() => AtendimentoModel, (atendimento) => atendimento.atendimentoDetalhe, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'id_atendimento' })
  atendimento: AtendimentoModel;

  @ManyToOne(() => ProdutoServicoModel, { eager: true })
  @JoinColumn({ name: 'id_produto_servico' })
  produtoServico: ProdutoServicoModel;
}
