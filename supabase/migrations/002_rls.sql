-- Activa RLS em todas as tabelas
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilizadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE diario_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE saldo_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fatura_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos_fatura ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE folha_salarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ausencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE obrigacoes_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE declaracoes_iva ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentos_bancarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE plafond_periodos ENABLE ROW LEVEL SECURITY;
ALTER TABLE plafond_pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE duvion_credit_perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE duvion_credit_avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE duvion_credit_alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE duvion_credit_utilizacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- Função helper
CREATE OR REPLACE FUNCTION get_empresa_id()
RETURNS UUID LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT empresa_id FROM utilizadores WHERE id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION get_perfil_utilizador()
RETURNS TEXT LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT perfil FROM utilizadores WHERE id = auth.uid() LIMIT 1
$$;

-- Políticas universais por empresa (tenant isolation)
DO $$
DECLARE
  t TEXT;
  tabelas TEXT[] := ARRAY[
    'clientes','fornecedores','categorias_financeiras','lancamentos',
    'diario_caixa','saldo_caixa','faturas','pagamentos_fatura',
    'funcionarios','folha_salarios','ausencias','obrigacoes_fiscais',
    'declaracoes_iva','contas_bancarias','movimentos_bancarios',
    'plafond_periodos','plafond_pedidos','duvion_credit_perfis',
    'duvion_credit_avaliacoes','duvion_credit_alertas',
    'duvion_credit_utilizacoes','notificacoes','auditoria',
    'departamentos','utilizadores'
  ];
BEGIN
  FOREACH t IN ARRAY tabelas LOOP
    EXECUTE format(
      'CREATE POLICY "isolamento_empresa" ON %I USING (empresa_id = get_empresa_id())', t
    );
  END LOOP;
END $$;

-- Planos: leitura pública
CREATE POLICY "planos_publicos" ON planos FOR SELECT USING (true);

-- Fatura itens: via fatura
CREATE POLICY "fatura_itens_empresa" ON fatura_itens
  USING (fatura_id IN (SELECT id FROM faturas WHERE empresa_id = get_empresa_id()));
