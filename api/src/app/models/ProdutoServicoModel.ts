import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'produto_servico' })
export class ProdutoServicoModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'tipo', nullable: false })
  tipo: number;
  @Column({ name: 'descricao', nullable: false, length: 100 })
  descricao: string;
  @Column({ name: 'custo', nullable: false, precision: 18, scale: 6 })
  custo: number;
  @Column({ name: 'valor', nullable: false, precision: 18, scale: 6 })
  valor: number;
  @Column({ name: 'saldo', nullable: false, precision: 18, scale: 6 })
  saldo: number;
  @Column({ name: 'bloqueado', nullable: false })
  bloqueado: boolean;
}
