import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fornecedor' })
export class FornecedorModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'nome', nullable: false, length: 100 })
  nome: string;
  @Column({ name: 'telefone', length: 40 })
  telefone: string;
  @Column({ name: 'dia_vencimento' })
  diaVencimento: number;
  @Column({ name: 'inativo' })
  inativo: boolean;
  @Column({ name: 'celular', length: 14 })
  celular: string;
}
