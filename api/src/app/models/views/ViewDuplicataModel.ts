import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';


@Entity({name: 'view_duplicata_pagar'})
export class ViewDuplicataPagarModel extends BaseEntity {

	@PrimaryColumn()
	id: number ;
	@Column({ name: 'data_compra', type: 'date'})
	dataCompra: Date ;
	@Column({ name: 'data_vencimento', type: 'date'})
	dataVencimento: Date ;
	@Column({ name: 'valor', precision: 18, scale: 6})
	valor: number ;
	@Column({ name: 'id_fornecedor'})
	idFornecedor: number ;
	@Column({ name: 'nome_fornecedor', length: 100})
	nomeFornecedor: string ;
	@Column({ name: 'valor_recebido', precision: 18, scale: 6})
	valorRecebido: number ;
	@Column({ name: 'status'})
	status: number ;
	@Column({ name: 'observacao', type: 'text'})
	observacao: string ;
}
