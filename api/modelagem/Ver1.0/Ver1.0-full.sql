/* ---------------------------------------------------------------------- */
/* Script generated with: DeZign for Databases V10.0.2                    */
/* Target DBMS:           PostgreSQL 9                                    */
/* Project file:          barber-db.dez                                   */
/* Project name:                                                          */
/* Author:                                                                */
/* Script type:           Database creation script                        */
/* Created on:            2021-11-04 21:19                                */
/* ---------------------------------------------------------------------- */


/* ---------------------------------------------------------------------- */
/* Add sequences                                                          */
/* ---------------------------------------------------------------------- */

CREATE SEQUENCE public.seq_usuario_id INCREMENT 1 MINVALUE 0 START 0;

CREATE SEQUENCE public.seq_servico_id INCREMENT 1 MINVALUE 0 START 0;

CREATE SEQUENCE public.seq_cliente_id INCREMENT 1 MINVALUE 0 START 0;

CREATE SEQUENCE public.seq_fornecedor_id INCREMENT 1 MINVALUE 0 START 0;

CREATE SEQUENCE public.seq_conta_id INCREMENT 1 MINVALUE 0 START 0;

CREATE SEQUENCE public.seq_produto_id INCREMENT 1 MINVALUE 0 START 0;

/* ---------------------------------------------------------------------- */
/* Add tables                                                             */
/* ---------------------------------------------------------------------- */

/* ---------------------------------------------------------------------- */
/* Add table "public.usuario"                                             */
/* ---------------------------------------------------------------------- */

CREATE TABLE public.usuario (
    id BIGSERIAL  NOT NULL,
    login CHARACTER VARYING(20)  NOT NULL,
    senha CHARACTER VARYING(40)  NOT NULL,
    perfil INTEGER  NOT NULL,
    inativo BOOLEAN DEFAULT false  NOT NULL,
    CONSTRAINT PK_usuario PRIMARY KEY (id)
);
INSERT INTO usuario(login, senha, perfil, inativo) 
VALUES ('ADMINISTRADOR', md5('123'), 0, false);

CREATE UNIQUE INDEX IDX_usuario_1 ON public.usuario (login);

/* ---------------------------------------------------------------------- */
/* Add table "public.cliente"                                             */
/* ---------------------------------------------------------------------- */

CREATE TABLE public.cliente (
    id BIGSERIAL  NOT NULL,
    nome CHARACTER VARYING(100)  NOT NULL,
    telefone CHARACTER VARYING(14),
    responsavel CHARACTER VARYING(100),
    ultimo_corte DATE,
    inativo BOOLEAN DEFAULT false,
    celular CHARACTER VARYING(14),
    CONSTRAINT PK_cliente PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "public.fornecedor"                                          */
/* ---------------------------------------------------------------------- */

CREATE TABLE public.fornecedor (
    id BIGSERIAL  NOT NULL,
    nome CHARACTER VARYING(100)  NOT NULL,
    telefone CHARACTER VARYING(14),
    dia_vencimento INTEGER,
    inativo BOOLEAN DEFAULT false,
    celular CHARACTER VARYING(14),
    CONSTRAINT PK_fornecedor PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "public.conta"                                               */
/* ---------------------------------------------------------------------- */

CREATE TABLE public.conta (
    id BIGSERIAL  NOT NULL,
    descricao CHARACTER VARYING(100)  NOT NULL,
    saldo NUMERIC(18,6)  NOT NULL,
    CONSTRAINT PK_conta PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "public.empresa"                                             */
/* ---------------------------------------------------------------------- */

CREATE TABLE public.empresa (
    id BIGSERIAL  NOT NULL,
    nome CHARACTER VARYING(100)  NOT NULL,
    endereco CHARACTER VARYING(100),
    telefone CHARACTER VARYING(40),
    instagram CHARACTER VARYING(40),
    facebook CHARACTER VARYING(40),
    CONSTRAINT PK_empresa PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "public.duplicata_pagar"                                     */
/* ---------------------------------------------------------------------- */

CREATE TABLE public.duplicata_pagar (
    id BIGSERIAL  NOT NULL,
    data_compra DATE  NOT NULL,
    data_vencimento DATE  NOT NULL,
    valor NUMERIC  NOT NULL,
    id_fornecedor BIGINT  NOT NULL,
    id_conta BIGINT,
    CONSTRAINT PK_duplicata_pagar PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "forma_pagamento"                                            */
/* ---------------------------------------------------------------------- */

CREATE TABLE forma_pagamento (
    id BIGSERIAL  NOT NULL,
    descricao CHARACTER VARYING(100)  NOT NULL,
    id_conta BIGINT  NOT NULL,
    desagio NUMERIC(18,6),
    padrao CHARACTER(5),
    CONSTRAINT PK_forma_pagamento PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "configuracoes"                                              */
/* ---------------------------------------------------------------------- */

CREATE TABLE configuracoes (
    id BIGSERIAL  NOT NULL,
    atendende_padrao BIGINT,
    CONSTRAINT PK_configuracoes PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "atendente"                                                  */
/* ---------------------------------------------------------------------- */

CREATE TABLE atendente (
    id BIGSERIAL  NOT NULL,
    nome CHARACTER VARYING(100)  NOT NULL,
    id_conta_comissao BIGINT  NOT NULL,
    inativo BOOLEAN  NOT NULL,
    CONSTRAINT PK_atendente PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "public.produto_servico"                                     */
/* ---------------------------------------------------------------------- */

CREATE TABLE public.produto_servico (
    id BIGSERIAL  NOT NULL,
    tipo INTEGER  NOT NULL,
    descricao CHARACTER VARYING(100)  NOT NULL,
    custo NUMERIC(18,6)  NOT NULL,
    valor NUMERIC(18,6)  NOT NULL,
    saldo NUMERIC(18,6)  NOT NULL,
    bloqueado BOOLEAN DEFAULT false  NOT NULL,
    CONSTRAINT PK_produto_servico PRIMARY KEY (id)
);

COMMENT ON COLUMN public.produto_servico.tipo IS '0-Produto, 1-Serviço';

/* ---------------------------------------------------------------------- */
/* Add table "agenda"                                                     */
/* ---------------------------------------------------------------------- */

CREATE TABLE agenda (
    id BIGSERIAL  NOT NULL,
    id_atendente BIGINT,
    nome CHARACTER VARYING(40)  NOT NULL,
    intervalo_minutos INTEGER  NOT NULL,
    CONSTRAINT PK_agenda PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "agenda_detalhe"                                             */
/* ---------------------------------------------------------------------- */

CREATE TABLE agenda_detalhe (
    id BIGSERIAL  NOT NULL,
    id_agenda BIGINT  NOT NULL,
    dia_semana BIGINT  NOT NULL,
    horario_inicio TIME  NOT NULL,
    horario_fim TIME  NOT NULL,
    CONSTRAINT PK_agenda_detalhe PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "entrada"                                                    */
/* ---------------------------------------------------------------------- */

CREATE TABLE entrada (
    id BIGSERIAL  NOT NULL,
    id_produto_servico BIGINT  NOT NULL,
    valor_unitario NUMERIC(18,6)  NOT NULL,
    data_entrada DATE  NOT NULL,
    valor_total NUMERIC(18,6)  NOT NULL,
    quantidade NUMERIC(18,6)  NOT NULL,
    CONSTRAINT PK_entrada PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "agendamento"                                                */
/* ---------------------------------------------------------------------- */

CREATE TABLE agendamento (
    id BIGSERIAL  NOT NULL,
    id_agenda BIGINT,
    id_cliente BIGINT  NOT NULL,
    id_atendente BIGINT,
    data DATE  NOT NULL,
    hora TIME  NOT NULL,
    status CHARACTER(1)  NOT NULL,
    observacao TEXT,
    CONSTRAINT PK_agendamento PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IDX_agendamento_1 ON agendamento (id_agenda,data,hora);

COMMENT ON COLUMN agendamento.status IS 'A-Aguardando, E-Em atendimento, C-Concluido, F-Faturado';

/* ---------------------------------------------------------------------- */
/* Add table "atendimento"                                                */
/* ---------------------------------------------------------------------- */

CREATE TABLE atendimento (
    id BIGSERIAL  NOT NULL,
    id_agendamento BIGINT  NOT NULL,
    id_forma_pagamento BIGINT,
    data_inicio DATE  NOT NULL,
    hora_inicio TIME DEFAULT '00:00'  NOT NULL,
    data_fim DATE,
    hora_fim TIME,
    valor_total NUMERIC(18,6)  NOT NULL,
    obs CHARACTER VARYING(200),
    CONSTRAINT PK_atendimento PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IDX_atendimento_1 ON atendimento (id_agendamento);

/* ---------------------------------------------------------------------- */
/* Add table "public.atendimento_detalhe"                                 */
/* ---------------------------------------------------------------------- */

CREATE TABLE public.atendimento_detalhe (
    id BIGSERIAL  NOT NULL,
    id_atendimento BIGINT  NOT NULL,
    id_produto_servico BIGINT  NOT NULL,
    tipo_produto_servico INTEGER  NOT NULL,
    quantidade NUMERIC(18,6)  NOT NULL,
    valor_unitario NUMERIC(18,6)  NOT NULL,
    valor_total NUMERIC(18,6)  NOT NULL,
    CONSTRAINT PK_atendimento_detalhe PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add table "movimentacao_conta"                                         */
/* ---------------------------------------------------------------------- */

CREATE TABLE movimentacao_conta (
    id BIGSERIAL  NOT NULL,
    id_conta BIGINT  NOT NULL,
    tipo CHARACTER(1)  NOT NULL,
    data_movimentacao DATE  NOT NULL,
    valor NUMERIC(18,6)  NOT NULL,
    descricao CHARACTER VARYING(100),
    id_atendimento BIGINT,
    CONSTRAINT PK_movimentacao_conta PRIMARY KEY (id)
);

/* ---------------------------------------------------------------------- */
/* Add foreign key constraints                                            */
/* ---------------------------------------------------------------------- */

ALTER TABLE movimentacao_conta ADD CONSTRAINT conta_movimentacao_conta 
    FOREIGN KEY (id_conta) REFERENCES public.conta (id);

ALTER TABLE movimentacao_conta ADD CONSTRAINT atendimento_movimentacao_conta 
    FOREIGN KEY (id_atendimento) REFERENCES atendimento (id);

ALTER TABLE public.duplicata_pagar ADD CONSTRAINT fornecedor_duplicata_pagar 
    FOREIGN KEY (id_fornecedor) REFERENCES public.fornecedor (id);

ALTER TABLE public.duplicata_pagar ADD CONSTRAINT conta_duplicata_pagar 
    FOREIGN KEY (id_conta) REFERENCES public.conta (id);

ALTER TABLE atendimento ADD CONSTRAINT forma_pagamento_atendimento 
    FOREIGN KEY (id_forma_pagamento) REFERENCES forma_pagamento (id);

ALTER TABLE atendimento ADD CONSTRAINT agendamento_atendimento 
    FOREIGN KEY (id_agendamento) REFERENCES agendamento (id);

ALTER TABLE forma_pagamento ADD CONSTRAINT conta_forma_pagamento 
    FOREIGN KEY (id_conta) REFERENCES public.conta (id);

ALTER TABLE agendamento ADD CONSTRAINT cliente_agendamento 
    FOREIGN KEY (id_cliente) REFERENCES public.cliente (id);

ALTER TABLE agendamento ADD CONSTRAINT atendente_agendamento 
    FOREIGN KEY (id_atendente) REFERENCES atendente (id);

ALTER TABLE agendamento ADD CONSTRAINT agenda_agendamento 
    FOREIGN KEY (id_agenda) REFERENCES agenda (id);

ALTER TABLE atendente ADD CONSTRAINT conta_atendente 
    FOREIGN KEY (id_conta_comissao) REFERENCES public.conta (id);

ALTER TABLE agenda ADD CONSTRAINT atendente_agenda 
    FOREIGN KEY (id_atendente) REFERENCES atendente (id);

ALTER TABLE agenda_detalhe ADD CONSTRAINT agenda_agenda_detalhe 
    FOREIGN KEY (id_agenda) REFERENCES agenda (id) ON DELETE CASCADE;

ALTER TABLE entrada ADD CONSTRAINT produto_servico_entrada 
    FOREIGN KEY (id_produto_servico) REFERENCES public.produto_servico (id);

ALTER TABLE public.atendimento_detalhe ADD CONSTRAINT atendimento_atendimento_detalhe 
    FOREIGN KEY (id_atendimento) REFERENCES atendimento (id) ON DELETE CASCADE;

ALTER TABLE public.atendimento_detalhe ADD CONSTRAINT produto_servico_atendimento_detalhe 
    FOREIGN KEY (id_produto_servico) REFERENCES public.produto_servico (id);

/* ---------------------------------------------------------------------- */
/* Add views                                                              */
/* ---------------------------------------------------------------------- */

CREATE OR REPLACE VIEW public.view_movimentacao_conta AS   
select  mc.id, mc.id_conta, conta.descricao as descricao_conta, mc.data_movimentacao, mc.tipo, mc.valor, mc.descricao
from movimentacao_conta mc
inner join conta on conta.id =  mc.id_conta;

CREATE OR REPLACE VIEW public.view_forma_pagamento AS 
select fp.id, fp.id_conta, fp.descricao, conta.descricao as descricao_conta, fp.desagio, fp.padrao 
from forma_pagamento fp
inner join conta on conta.id = fp.id_conta;

CREATE OR REPLACE VIEW public.view_atendente AS 
select at.id, at.nome, at.id_conta_comissao, conta.descricao as descricao_conta, at.inativo
from atendente at
inner join conta on conta.id =  at.id_conta_comissao;

CREATE OR REPLACE VIEW public.view_agendamento AS 
select ag.id, ag.data, ag.hora, ag.id_cliente, cliente.nome as nome_cliente, ag.id_atendente, atendente.nome as nome_atendente, ag.status, ag.observacao, ag.id_agenda, cliente.telefone, cliente.celular
from agendamento ag
inner join cliente on cliente.id = ag.id_cliente
inner join atendente on atendente.id = ag.id_atendente;

CREATE OR REPLACE VIEW public.view_duplicata_pagar AS    
select dp.id, dp.data_compra, dp.data_vencimento, dp.valor, dp.id_fornecedor, fornecedor.nome as nome_fornecedor, dp.id_conta, conta.descricao as descricao_conta
from duplicata_pagar dp
inner join fornecedor on fornecedor.id = dp.id_fornecedor
inner join conta on conta.id = dp.id_conta;

/* ---------------------------------------------------------------------- */
/* Add procedures                                                         */
/* ---------------------------------------------------------------------- */

CREATE OR REPLACE FUNCTION public.atualizar_sequences() RETURNS void AS $$
DECLARE
	QTD BIGINT;
	statements CURSOR FOR
    	SELECT
        	tablename 
        FROM 
        	pg_tables
        WHERE 
        	schemaname = 'public'
        ORDER BY
        	tablename ASC;
BEGIN
	FOR stmt IN statements LOOP
    	IF EXISTS (SELECT * FROM information_schema.sequences WHERE sequence_schema = 'public' AND sequence_name = quote_ident(stmt.tablename || '_id_seq')) THEN
		BEGIN
			EXECUTE 'SELECT coalesce(max(id), 0) FROM public.' || stmt.tablename INTO QTD;
				IF QTD = 0 THEN 
					EXECUTE 'SELECT SETVAL(''' ||  'public.' || stmt.tablename || '_id_seq'',1,FALSE);';
				END IF;
				IF QTD > 0 THEN 
					EXECUTE 'SELECT SETVAL(''' ||  'public.' || stmt.tablename || '_id_seq'',' || QTD || ');';
				END IF;
		END;
        END IF;
    END LOOP;
END;

$$ LANGUAGE plpgsql;
