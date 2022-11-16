import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name: 'view_atendente'})
export class ViewAtendenteModel extends BaseEntity {

	@PrimaryColumn()
	id: number ;
	@Column({ name: 'nome', length: 100})
	nome: string ;
	@Column({ name: 'id_conta_comissao'})
	idContaComissao: number ;
	@Column({ name: 'descricao_conta', length: 100})
	descricaoConta: string ;
	@Column({ name: 'inativo', length: 5})
	inativo: string ;

}