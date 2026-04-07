-- ═══════════════════════════════════════════════
-- SEED — DADOS DE TESTE DUVION ERP
-- Credenciais: admin@duvion.ao / Duvion@2025#Admin
-- ═══════════════════════════════════════════════

-- 1. Criar utilizador admin via Supabase Auth (faz via script Node abaixo)
-- 2. Inserir empresa de demo

INSERT INTO empresas (id, nome, nif, endereco, cidade, telefone, email, plano_id)
SELECT
  '00000000-0000-0000-0000-000000000001',
  'Duvion Tecnologia Lda',
  '5417892310',
  'Rua Rainha Ginga, 45, Ingombota',
  'Luanda',
  '+244 923 456 789',
  'admin@duvion.ao',
  id
FROM planos WHERE nome = 'pro'
ON CONFLICT DO NOTHING;

-- 3. Departamentos demo
INSERT INTO departamentos (empresa_id, nome, codigo, plafond_mensal) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Direcção Geral', 'DG', 500000),
  ('00000000-0000-0000-0000-000000000001', 'Financeiro', 'FIN', 300000),
  ('00000000-0000-0000-0000-000000000001', 'Comercial', 'COM', 400000),
  ('00000000-0000-0000-0000-000000000001', 'Recursos Humanos', 'RH', 150000),
  ('00000000-0000-0000-0000-000000000001', 'Tecnologia', 'TEC', 250000)
ON CONFLICT DO NOTHING;

-- 4. Categorias financeiras padrão
INSERT INTO categorias_financeiras (empresa_id, nome, tipo, cor) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Vendas de Serviços', 'receita', '#10b981'),
  ('00000000-0000-0000-0000-000000000001', 'Vendas de Produtos', 'receita', '#3b82f6'),
  ('00000000-0000-0000-0000-000000000001', 'Outros Rendimentos', 'receita', '#8b5cf6'),
  ('00000000-0000-0000-0000-000000000001', 'Salários', 'despesa', '#ef4444'),
  ('00000000-0000-0000-0000-000000000001', 'Rendas e Alugueres', 'despesa', '#f97316'),
  ('00000000-0000-0000-0000-000000000001', 'Serviços Externos', 'despesa', '#f59e0b'),
  ('00000000-0000-0000-0000-000000000001', 'Material de Escritório', 'despesa', '#6b7280'),
  ('00000000-0000-0000-0000-000000000001', 'Impostos e Taxas', 'despesa', '#dc2626'),
  ('00000000-0000-0000-0000-000000000001', 'Marketing e Publicidade', 'despesa', '#7c3aed'),
  ('00000000-0000-0000-0000-000000000001', 'Combustível e Transporte', 'despesa', '#059669')
ON CONFLICT DO NOTHING;

-- 5. Conta bancária demo
INSERT INTO contas_bancarias (empresa_id, banco, nome_conta, numero_conta, saldo_actual, is_principal) VALUES
  ('00000000-0000-0000-0000-000000000001', 'BAI — Banco Angolano de Investimentos', 'Conta Principal', '0001234567890', 4500000, true),
  ('00000000-0000-0000-0000-000000000001', 'BFA — Banco de Fomento Angola', 'Conta Operacional', '9876543210001', 1200000, false)
ON CONFLICT DO NOTHING;

-- 6. Clientes demo
INSERT INTO clientes (empresa_id, nome, nif, tipo, email, telefone, cidade, categoria) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sonangol EP', '5000000001', 'colectivo', 'compras@sonangol.co.ao', '+244 222 334 001', 'Luanda', 'vip'),
  ('00000000-0000-0000-0000-000000000001', 'UNITEL SA', '5000000002', 'colectivo', 'fornecedores@unitel.co.ao', '+244 912 000 001', 'Luanda', 'vip'),
  ('00000000-0000-0000-0000-000000000001', 'Mota-Engil Angola', '5000000003', 'colectivo', 'geral@mota-engil.ao', '+244 222 001 234', 'Luanda', 'normal'),
  ('00000000-0000-0000-0000-000000000001', 'João Manuel Ferreira', '007123456LA087', 'singular', 'joao.ferreira@gmail.com', '+244 921 234 567', 'Luanda', 'normal'),
  ('00000000-0000-0000-0000-000000000001', 'Candinha Distribuidora Lda', '5417111222', 'colectivo', 'geral@candinha.ao', '+244 923 111 222', 'Benguela', 'normal')
ON CONFLICT DO NOTHING;

-- 7. Funcionários demo
INSERT INTO funcionarios (empresa_id, numero, nome, cargo, salario_base, subsidio_alimentacao, subsidio_transporte, data_admissao) VALUES
  ('00000000-0000-0000-0000-000000000001', 'DV001', 'António Silva', 'Director Geral', 450000, 15000, 10000, '2022-01-01'),
  ('00000000-0000-0000-0000-000000000001', 'DV002', 'Maria Fernanda', 'Directora Financeira', 320000, 15000, 10000, '2022-03-15'),
  ('00000000-0000-0000-0000-000000000001', 'DV003', 'Carlos Mendes', 'Engenheiro de Software', 280000, 15000, 10000, '2022-06-01'),
  ('00000000-0000-0000-0000-000000000001', 'DV004', 'Ana Beatriz', 'Gestora Comercial', 250000, 15000, 8000, '2023-01-15'),
  ('00000000-0000-0000-0000-000000000001', 'DV005', 'Pedro Lopes', 'Técnico de RH', 200000, 15000, 8000, '2023-04-01')
ON CONFLICT DO NOTHING;

-- 8. Perfil DuvionCredit (começa no bronze)
INSERT INTO duvion_credit_perfis (empresa_id, score_actual, nivel, certificado_codigo)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  0,
  'bronze',
  'DVC-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8))
)
ON CONFLICT DO NOTHING;
