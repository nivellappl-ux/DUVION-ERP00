-- ═══════════════════════════════════════════════
-- EXTENSÕES
-- ═══════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_crypto";

-- ═══════════════════════════════════════════════
-- PLANOS / PACOTES
-- ═══════════════════════════════════════════════
CREATE TABLE planos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,  -- 'starter', 'pro', 'enterprise'
  label TEXT NOT NULL, -- 'Starter', 'Pro', 'Enterprise'
  preco_mensal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tem_duvion_credit BOOLEAN DEFAULT false,
  max_utilizadores INTEGER DEFAULT 3,
  max_departamentos INTEGER DEFAULT 3,
  funcionalidades JSONB DEFAULT '[]',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO planos (nome, label, preco_mensal, tem_duvion_credit, max_utilizadores, max_departamentos, funcionalidades) VALUES
  ('starter', 'Starter', 15000, false, 3, 3, '["dashboard","finance","faturacao","caixa"]'),
  ('pro', 'Pro', 35000, true, 15, 10, '["dashboard","finance","faturacao","caixa","rh","fiscalidade","banco","plafond","duvion_credit"]'),
  ('enterprise', 'Enterprise', 75000, true, 999, 999, '["tudo"]');

-- ═══════════════════════════════════════════════
-- EMPRESAS
-- ═══════════════════════════════════════════════
CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  nif TEXT NOT NULL UNIQUE,
  endereco TEXT,
  cidade TEXT DEFAULT 'Luanda',
  provincia TEXT DEFAULT 'Luanda',
  telefone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  moeda TEXT DEFAULT 'AOA',
  plano_id UUID REFERENCES planos(id),
  plano_activo_desde DATE DEFAULT CURRENT_DATE,
  plano_validade DATE,
  activo BOOLEAN DEFAULT true,
  configuracoes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- UTILIZADORES
-- ═══════════════════════════════════════════════
CREATE TABLE utilizadores (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  cargo TEXT,
  departamento_id UUID,
  perfil TEXT DEFAULT 'operador'
    CHECK (perfil IN ('super_admin','admin','gestor','contabilista','rh','operador','visualizador')),
  avatar_url TEXT,
  ultimo_login TIMESTAMPTZ,
  activo BOOLEAN DEFAULT true,
  preferencias JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- DEPARTAMENTOS
-- ═══════════════════════════════════════════════
CREATE TABLE departamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  codigo TEXT NOT NULL,
  responsavel_id UUID REFERENCES utilizadores(id),
  plafond_mensal NUMERIC(15,2) DEFAULT 0,
  plafond_usado NUMERIC(15,2) DEFAULT 0,
  cor TEXT DEFAULT '#6366f1',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(empresa_id, codigo)
);

ALTER TABLE utilizadores ADD CONSTRAINT fk_departamento
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id);

-- ═══════════════════════════════════════════════
-- CLIENTES
-- ═══════════════════════════════════════════════
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  nif TEXT,
  tipo TEXT DEFAULT 'singular' CHECK (tipo IN ('singular','colectivo')),
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  provincia TEXT,
  pais TEXT DEFAULT 'Angola',
  limite_credito NUMERIC(15,2) DEFAULT 0,
  saldo_devedor NUMERIC(15,2) DEFAULT 0,
  categoria TEXT DEFAULT 'normal' CHECK (categoria IN ('vip','normal','risco')),
  notas TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- FORNECEDORES
-- ═══════════════════════════════════════════════
CREATE TABLE fornecedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  nif TEXT,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  pais TEXT DEFAULT 'Angola',
  conta_bancaria TEXT,
  iban TEXT,
  condicoes_pagamento INTEGER DEFAULT 30,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- CATEGORIAS FINANCEIRAS
-- ═══════════════════════════════════════════════
CREATE TABLE categorias_financeiras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita','despesa')),
  cor TEXT DEFAULT '#6366f1',
  icone TEXT,
  parent_id UUID REFERENCES categorias_financeiras(id),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorias padrão inseridas via seed

-- ═══════════════════════════════════════════════
-- FINANCE — RECEITAS & DESPESAS
-- ═══════════════════════════════════════════════
CREATE TABLE lancamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('receita','despesa')),
  descricao TEXT NOT NULL,
  valor NUMERIC(15,2) NOT NULL,
  data_lancamento DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria_id UUID REFERENCES categorias_financeiras(id),
  departamento_id UUID REFERENCES departamentos(id),
  cliente_id UUID REFERENCES clientes(id),
  fornecedor_id UUID REFERENCES fornecedores(id),
  fatura_id UUID,
  conta_bancaria_id UUID,
  metodo_pagamento TEXT DEFAULT 'transferencia'
    CHECK (metodo_pagamento IN ('dinheiro','transferencia','multicaixa','tpa','cheque','outro')),
  referencia TEXT,
  estado TEXT DEFAULT 'confirmado' CHECK (estado IN ('pendente','confirmado','cancelado')),
  recorrente BOOLEAN DEFAULT false,
  recorrencia_tipo TEXT CHECK (recorrencia_tipo IN ('diario','semanal','mensal','anual')),
  notas TEXT,
  anexo_url TEXT,
  criado_por UUID REFERENCES utilizadores(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- DIÁRIO DE CAIXA
-- ═══════════════════════════════════════════════
CREATE TABLE diario_caixa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  data_movimento DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada','saida','transferencia','ajuste')),
  descricao TEXT NOT NULL,
  valor NUMERIC(15,2) NOT NULL,
  saldo_anterior NUMERIC(15,2) NOT NULL DEFAULT 0,
  saldo_apos NUMERIC(15,2) NOT NULL DEFAULT 0,
  categoria_id UUID REFERENCES categorias_financeiras(id),
  departamento_id UUID REFERENCES departamentos(id),
  referencia_tipo TEXT, -- 'fatura', 'pagamento_salario', 'despesa', 'manual'
  referencia_id UUID,
  metodo TEXT DEFAULT 'dinheiro'
    CHECK (metodo IN ('dinheiro','transferencia','multicaixa','tpa','cheque')),
  conferido BOOLEAN DEFAULT false,
  conferido_por UUID REFERENCES utilizadores(id),
  conferido_em TIMESTAMPTZ,
  notas TEXT,
  criado_por UUID REFERENCES utilizadores(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saldo actual de caixa (computed via trigger)
CREATE TABLE saldo_caixa (
  empresa_id UUID PRIMARY KEY REFERENCES empresas(id),
  saldo_actual NUMERIC(15,2) DEFAULT 0,
  ultima_actualizacao TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- FATURAÇÃO
-- ═══════════════════════════════════════════════
CREATE TABLE faturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  numero TEXT NOT NULL,
  serie TEXT DEFAULT 'A',
  tipo TEXT DEFAULT 'fatura' CHECK (tipo IN ('fatura','fatura_recibo','nota_credito','pro_forma','recibo')),
  cliente_id UUID REFERENCES clientes(id),
  cliente_nome TEXT NOT NULL,
  cliente_nif TEXT,
  cliente_endereco TEXT,
  data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_vencimento DATE,
  estado TEXT DEFAULT 'rascunho'
    CHECK (estado IN ('rascunho','emitida','paga','paga_parcial','vencida','anulada')),
  subtotal NUMERIC(15,2) DEFAULT 0,
  total_desconto NUMERIC(15,2) DEFAULT 0,
  total_iva NUMERIC(15,2) DEFAULT 0,
  total NUMERIC(15,2) DEFAULT 0,
  valor_pago NUMERIC(15,2) DEFAULT 0,
  valor_em_divida NUMERIC(15,2) DEFAULT 0,
  moeda TEXT DEFAULT 'AOA',
  cambio_usd NUMERIC(10,4) DEFAULT 1,
  notas TEXT,
  notas_internas TEXT,
  referencia_nota_credito UUID REFERENCES faturas(id),
  pdf_url TEXT,
  criado_por UUID REFERENCES utilizadores(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(empresa_id, numero, serie)
);

CREATE TABLE fatura_itens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fatura_id UUID NOT NULL REFERENCES faturas(id) ON DELETE CASCADE,
  produto_id UUID,
  descricao TEXT NOT NULL,
  unidade TEXT DEFAULT 'UN',
  quantidade NUMERIC(10,3) NOT NULL DEFAULT 1,
  preco_unitario NUMERIC(15,2) NOT NULL DEFAULT 0,
  desconto_percent NUMERIC(5,2) DEFAULT 0,
  taxa_iva NUMERIC(5,2) DEFAULT 14,
  subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
  valor_desconto NUMERIC(15,2) DEFAULT 0,
  valor_iva NUMERIC(15,2) NOT NULL DEFAULT 0,
  total NUMERIC(15,2) NOT NULL DEFAULT 0,
  ordem INTEGER DEFAULT 0
);

CREATE TABLE pagamentos_fatura (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  fatura_id UUID NOT NULL REFERENCES faturas(id),
  valor NUMERIC(15,2) NOT NULL,
  data_pagamento DATE NOT NULL DEFAULT CURRENT_DATE,
  metodo TEXT DEFAULT 'transferencia'
    CHECK (metodo IN ('dinheiro','transferencia','multicaixa','tpa','cheque','outro')),
  referencia TEXT,
  notas TEXT,
  criado_por UUID REFERENCES utilizadores(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- RECURSOS HUMANOS
-- ═══════════════════════════════════════════════
CREATE TABLE funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  numero TEXT NOT NULL,
  nome TEXT NOT NULL,
  bi TEXT,
  nif TEXT,
  data_nascimento DATE,
  genero TEXT CHECK (genero IN ('M','F','outro')),
  estado_civil TEXT,
  data_admissao DATE NOT NULL,
  data_saida DATE,
  motivo_saida TEXT,
  cargo TEXT NOT NULL,
  departamento_id UUID REFERENCES departamentos(id),
  categoria_profissional TEXT,
  tipo_contrato TEXT DEFAULT 'indefinido'
    CHECK (tipo_contrato IN ('indefinido','prazo_certo','prestacao_servicos','estagio','part_time')),
  salario_base NUMERIC(15,2) NOT NULL DEFAULT 0,
  subsidio_alimentacao NUMERIC(15,2) DEFAULT 0,
  subsidio_transporte NUMERIC(15,2) DEFAULT 0,
  outros_subsidios NUMERIC(15,2) DEFAULT 0,
  banco TEXT,
  iban TEXT,
  numero_inss TEXT,
  email_corporativo TEXT,
  telefone TEXT,
  endereco TEXT,
  activo BOOLEAN DEFAULT true,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(empresa_id, numero)
);

CREATE TABLE folha_salarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id),
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INTEGER NOT NULL,
  salario_base NUMERIC(15,2) NOT NULL,
  subsidio_alimentacao NUMERIC(15,2) DEFAULT 0,
  subsidio_transporte NUMERIC(15,2) DEFAULT 0,
  outros_subsidios NUMERIC(15,2) DEFAULT 0,
  horas_extra_horas NUMERIC(6,2) DEFAULT 0,
  horas_extra_valor NUMERIC(15,2) DEFAULT 0,
  faltas_dias INTEGER DEFAULT 0,
  faltas_desconto NUMERIC(15,2) DEFAULT 0,
  outros_descontos NUMERIC(15,2) DEFAULT 0,
  inss_trabalhador NUMERIC(15,2) DEFAULT 0,   -- 3%
  inss_patronal NUMERIC(15,2) DEFAULT 0,       -- 8%
  irt NUMERIC(15,2) DEFAULT 0,
  salario_iliquido NUMERIC(15,2) DEFAULT 0,
  total_descontos NUMERIC(15,2) DEFAULT 0,
  salario_liquido NUMERIC(15,2) DEFAULT 0,
  estado TEXT DEFAULT 'calculado'
    CHECK (estado IN ('calculado','aprovado','pago','cancelado')),
  aprovado_por UUID REFERENCES utilizadores(id),
  aprovado_em TIMESTAMPTZ,
  pago_em TIMESTAMPTZ,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(funcionario_id, mes, ano)
);

CREATE TABLE ausencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  funcionario_id UUID NOT NULL REFERENCES funcionarios(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('ferias','falta_justificada','falta_injustificada','licenca','outros')),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias_uteis INTEGER DEFAULT 0,
  aprovado_por UUID REFERENCES utilizadores(id),
  estado TEXT DEFAULT 'pendente' CHECK (estado IN ('pendente','aprovado','rejeitado')),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- FISCALIDADE
-- ═══════════════════════════════════════════════
CREATE TABLE obrigacoes_fiscais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('iva','irt','inss','imposto_industrial','outro')),
  periodo_mes INTEGER CHECK (periodo_mes BETWEEN 1 AND 12),
  periodo_ano INTEGER NOT NULL,
  valor_apurado NUMERIC(15,2) DEFAULT 0,
  valor_pago NUMERIC(15,2) DEFAULT 0,
  data_limite DATE,
  data_pagamento DATE,
  estado TEXT DEFAULT 'pendente' CHECK (estado IN ('pendente','pago','em_atraso','isento')),
  referencia_agt TEXT,
  documento_url TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE declaracoes_iva (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INTEGER NOT NULL,
  total_vendas NUMERIC(15,2) DEFAULT 0,
  total_iva_cobrado NUMERIC(15,2) DEFAULT 0,
  total_compras NUMERIC(15,2) DEFAULT 0,
  total_iva_dedutivel NUMERIC(15,2) DEFAULT 0,
  iva_a_pagar NUMERIC(15,2) DEFAULT 0,
  estado TEXT DEFAULT 'rascunho' CHECK (estado IN ('rascunho','submetido','aceite','rejeitado')),
  submetido_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(empresa_id, mes, ano)
);

-- ═══════════════════════════════════════════════
-- CONTA BANCÁRIA
-- ═══════════════════════════════════════════════
CREATE TABLE contas_bancarias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  banco TEXT NOT NULL,
  nome_conta TEXT NOT NULL,
  numero_conta TEXT NOT NULL,
  iban TEXT,
  moeda TEXT DEFAULT 'AOA',
  saldo_actual NUMERIC(15,2) DEFAULT 0,
  saldo_disponivel NUMERIC(15,2) DEFAULT 0,
  is_principal BOOLEAN DEFAULT false,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE movimentos_bancarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  conta_id UUID NOT NULL REFERENCES contas_bancarias(id),
  data_movimento DATE NOT NULL,
  data_valor DATE,
  tipo TEXT NOT NULL CHECK (tipo IN ('credito','debito')),
  descricao TEXT NOT NULL,
  valor NUMERIC(15,2) NOT NULL,
  saldo_apos NUMERIC(15,2),
  referencia TEXT,
  categoria_id UUID REFERENCES categorias_financeiras(id),
  reconciliado BOOLEAN DEFAULT false,
  lancamento_id UUID REFERENCES lancamentos(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- PLAFOND — ORÇAMENTO POR DEPARTAMENTOS
-- ═══════════════════════════════════════════════
CREATE TABLE plafond_periodos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  departamento_id UUID NOT NULL REFERENCES departamentos(id),
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INTEGER NOT NULL,
  valor_aprovado NUMERIC(15,2) NOT NULL DEFAULT 0,
  valor_usado NUMERIC(15,2) DEFAULT 0,
  valor_disponivel NUMERIC(15,2) GENERATED ALWAYS AS (valor_aprovado - valor_usado) STORED,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo','esgotado','excedido','encerrado')),
  aprovado_por UUID REFERENCES utilizadores(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(departamento_id, mes, ano)
);

CREATE TABLE plafond_pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  departamento_id UUID NOT NULL REFERENCES departamentos(id),
  periodo_id UUID REFERENCES plafond_periodos(id),
  solicitado_por UUID NOT NULL REFERENCES utilizadores(id),
  descricao TEXT NOT NULL,
  valor_pedido NUMERIC(15,2) NOT NULL,
  valor_aprovado NUMERIC(15,2),
  categoria_id UUID REFERENCES categorias_financeiras(id),
  estado TEXT DEFAULT 'pendente'
    CHECK (estado IN ('pendente','aprovado','rejeitado','executado','cancelado')),
  aprovado_por UUID REFERENCES utilizadores(id),
  aprovado_em TIMESTAMPTZ,
  data_necessidade DATE,
  justificacao TEXT,
  comprovativo_url TEXT,
  notas_aprovacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- DUVION CREDIT — MOTOR DE SCORE
-- ═══════════════════════════════════════════════
CREATE TABLE duvion_credit_perfis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID UNIQUE NOT NULL REFERENCES empresas(id),
  score_actual INTEGER DEFAULT 0 CHECK (score_actual BETWEEN 0 AND 1000),
  nivel TEXT DEFAULT 'bronze' CHECK (nivel IN ('bronze','prata','ouro','platina')),
  score_faturacao INTEGER DEFAULT 0,       -- max 300 pts
  score_caixa INTEGER DEFAULT 0,           -- max 250 pts
  score_finance INTEGER DEFAULT 0,         -- max 250 pts
  score_rh INTEGER DEFAULT 0,              -- max 200 pts
  credito_operacional_disponivel NUMERIC(15,2) DEFAULT 0,
  credito_expansao_disponivel NUMERIC(15,2) DEFAULT 0,
  credito_parceiro_disponivel NUMERIC(15,2) DEFAULT 0,
  percentagem_desconto_mensal NUMERIC(5,2) DEFAULT 0,
  ultima_avaliacao TIMESTAMPTZ,
  proxima_avaliacao DATE,
  certificado_codigo TEXT UNIQUE,          -- código QR público verificável
  certificado_url TEXT,
  historico_score JSONB DEFAULT '[]',      -- [{mes, ano, score, nivel}]
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE duvion_credit_avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  perfil_id UUID NOT NULL REFERENCES duvion_credit_perfis(id),
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  score_total INTEGER NOT NULL,
  score_faturacao INTEGER NOT NULL,
  score_caixa INTEGER NOT NULL,
  score_finance INTEGER NOT NULL,
  score_rh INTEGER NOT NULL,
  nivel_anterior TEXT,
  nivel_novo TEXT,
  metricas_usadas JSONB NOT NULL DEFAULT '{}',
  credito_operacional NUMERIC(15,2) DEFAULT 0,
  credito_expansao NUMERIC(15,2) DEFAULT 0,
  credito_parceiro NUMERIC(15,2) DEFAULT 0,
  desconto_aplicado NUMERIC(5,2) DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE duvion_credit_alertas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('score_subiu','score_desceu','nivel_mudou','credito_disponivel','aviso_queda','oportunidade')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  pontos_em_risco INTEGER DEFAULT 0,
  accao_sugerida TEXT,
  lido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE duvion_credit_utilizacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  perfil_id UUID NOT NULL REFERENCES duvion_credit_perfis(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('operacional','expansao','parceiro')),
  valor NUMERIC(15,2) NOT NULL,
  descricao TEXT NOT NULL,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo','liquidado','cancelado')),
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_liquidacao DATE,
  parcelas INTEGER DEFAULT 1,
  valor_por_parcela NUMERIC(15,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- NOTIFICAÇÕES
-- ═══════════════════════════════════════════════
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  utilizador_id UUID REFERENCES utilizadores(id),
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT,
  link TEXT,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════
-- AUDITORIA
-- ═══════════════════════════════════════════════
CREATE TABLE auditoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  utilizador_id UUID REFERENCES utilizadores(id),
  accao TEXT NOT NULL,
  tabela TEXT,
  registo_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
