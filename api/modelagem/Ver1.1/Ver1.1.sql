drop view view_forma_pagamento;
ALTER TABLE forma_pagamento ALTER COLUMN padrao TYPE BOOLEAN USING padrao::boolean;

CREATE OR REPLACE VIEW public.view_forma_pagamento AS 
select fp.id, fp.id_conta, fp.descricao, conta.descricao as descricao_conta, fp.desagio, fp.padrao 
from forma_pagamento fp
inner join conta on conta.id = fp.id_conta;