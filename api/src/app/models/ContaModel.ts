import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'conta' })
export class ContaModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'descricao', nullable: false, length: 100 })
  descricao: string;
  @Column({ name: 'saldo', precision: 16, scale: 8 })
  saldo: number;
}
