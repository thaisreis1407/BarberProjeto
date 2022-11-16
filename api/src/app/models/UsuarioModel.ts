import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum PerfilUsuario {
  ADMINISTRADOR = 0,
  GERENTE = 1,
  FUNCIONARIO = 2,
  CLIENTE = 3,
}

@Entity({ name: 'usuario' })
export class UsuarioModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'login', nullable: false, length: 20 })
  login: string;
  @Column({ name: 'senha', nullable: false, length: 40 })
  senha: string;
  @Column({
    name: 'perfil',
    nullable: false,
    transformer: {
      from: (v) => PerfilUsuario[v],
      to: (v) => PerfilUsuario[v],
    },
  })
  perfil: string;
  @Column({ name: 'inativo', nullable: false })
  inativo: boolean;
}
