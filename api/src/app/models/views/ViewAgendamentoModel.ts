import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name: 'view_agendamento'})
export class ViewAgendamentoModel extends BaseEntity {

	@PrimaryColumn()
	id: number ;
	@Column({ name: 'data', type: 'date'})
	data: Date ;
	@Column({ name: 'hora', type: 'time'})
	hora: Date ;
	@Column({ name: 'id_cliente'})
	idCliente: number ;
	@Column({ name: 'nome_cliente', length: 100})
	nomeCliente: string ;
	@Column({ name: 'id_atendente'})
	idAtendente: number ;
	@Column({ name: 'nome_atendente', length: 100})
	nomeAtendente: string ;
	@Column({ name: 'status', length: 1})
	status: string ;
	@Column({ name: 'observacao', type: 'text'})
	observacao: string ;
	@Column({ name: 'id_agenda'})
	idAgenda: number ;
	@Column({ name: 'telefone', length: 40})
	telefone: string ;
	@Column({ name: 'celular', length: 14})
	celular: string ;



}