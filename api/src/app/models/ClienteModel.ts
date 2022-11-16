import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cliente' })
export class ClienteModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'nome', nullable: false, length: 100 })
  nome: string;
  @Column({ name: 'telefone', length: 40 })
  telefone: string;
  @Column({ name: 'responsavel', length: 100 })
  responsavel: string;
  @Column({ name: 'ultimo_corte', type: 'date' })
  ultimoCorte: Date;
  @Column({ name: 'inativo' })
  inativo: boolean;
  @Column({ name: 'celular', length: 14 })
  celular: string;
}
