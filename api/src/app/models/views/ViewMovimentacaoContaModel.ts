import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name: 'view_movimentacao_conta'})
export class ViewMovimentacaoContaModel extends BaseEntity {

	@PrimaryColumn()
	id: number ;
	@Column({ name: 'id_conta'})
	idConta: number ;
	@Column({ name: 'descricao_conta', length: 100})
	descricaoConta: string ;
	@Column({ name: 'data_movimentacao', type: 'date'})
	dataMovimentacao: Date ;
	@Column({ name: 'tipo', length: 1})
	tipo: string ;
	@Column({ name: 'valor', precision: 18, scale: 6})
	valor: number ;
	@Column({ name: 'descricao', length: 100})
	descricao: string ;

}