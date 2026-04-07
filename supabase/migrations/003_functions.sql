-- ───────────────────────────────────────
-- TRIGGER: actualizar saldo de caixa
-- ───────────────────────────────────────
CREATE OR REPLACE FUNCTION actualizar_saldo_caixa()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO saldo_caixa (empresa_id, saldo_actual, ultima_actualizacao)
  VALUES (NEW.empresa_id, NEW.saldo_apos, NOW())
  ON CONFLICT (empresa_id) DO UPDATE
    SET saldo_actual = NEW.saldo_apos, ultima_actualizacao = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_saldo_caixa
  AFTER INSERT ON diario_caixa
  FOR EACH ROW EXECUTE FUNCTION actualizar_saldo_caixa();

-- ───────────────────────────────────────
-- TRIGGER: actualizar valor_em_divida da fatura
-- ───────────────────────────────────────
CREATE OR REPLACE FUNCTION actualizar_divida_fatura()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE faturas SET
    valor_pago = (
      SELECT COALESCE(SUM(valor), 0)
      FROM pagamentos_fatura WHERE fatura_id = NEW.fatura_id
    ),
    valor_em_divida = total - (
      SELECT COALESCE(SUM(valor), 0)
      FROM pagamentos_fatura WHERE fatura_id = NEW.fatura_id
    ),
    estado = CASE
      WHEN total <= (SELECT COALESCE(SUM(valor),0) FROM pagamentos_fatura WHERE fatura_id = NEW.fatura_id)
        THEN 'paga'
      WHEN (SELECT COALESCE(SUM(valor),0) FROM pagamentos_fatura WHERE fatura_id = NEW.fatura_id) > 0
        THEN 'paga_parcial'
      ELSE estado
    END,
    updated_at = NOW()
  WHERE id = NEW.fatura_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_divida_fatura
  AFTER INSERT ON pagamentos_fatura
  FOR EACH ROW EXECUTE FUNCTION actualizar_divida_fatura();

-- ───────────────────────────────────────
-- TRIGGER: plafond usado ao criar pedido aprovado
-- ───────────────────────────────────────
CREATE OR REPLACE FUNCTION actualizar_plafond_usado()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.estado = 'executado' AND (OLD.estado IS NULL OR OLD.estado != 'executado') THEN
    UPDATE plafond_periodos SET
      valor_usado = valor_usado + COALESCE(NEW.valor_aprovado, NEW.valor_pedido),
      estado = CASE
        WHEN valor_usado + COALESCE(NEW.valor_aprovado, NEW.valor_pedido) >= valor_aprovado THEN 'esgotado'
        ELSE estado
      END,
      updated_at = NOW()
    WHERE id = NEW.periodo_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_plafond_usado
  AFTER UPDATE ON plafond_pedidos
  FOR EACH ROW EXECUTE FUNCTION actualizar_plafond_usado();

-- ───────────────────────────────────────
-- FUNÇÃO: calcular score DuvionCredit
-- ───────────────────────────────────────
CREATE OR REPLACE FUNCTION calcular_score_duvion(p_empresa_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_score_faturacao INTEGER := 0;
  v_score_caixa INTEGER := 0;
  v_score_finance INTEGER := 0;
  v_score_rh INTEGER := 0;
  v_score_total INTEGER := 0;
  v_nivel TEXT;
  v_metricas JSONB;

  -- Métricas de faturação (max 300 pts)
  v_fat_media_mensal NUMERIC;
  v_fat_meses_activos INTEGER;
  v_fat_crescimento NUMERIC;

  -- Métricas de caixa (max 250 pts)
  v_caixa_saldo_medio NUMERIC;
  v_caixa_meses_positivos INTEGER;

  -- Métricas finance (max 250 pts)
  v_receita_total NUMERIC;
  v_despesa_total NUMERIC;
  v_racio NUMERIC;

  -- Métricas RH (max 200 pts)
  v_func_activos INTEGER;
  v_salarios_pagos_tempo INTEGER;

BEGIN
  -- ── SCORE FATURAÇÃO (max 300 pts) ──
  SELECT
    COALESCE(AVG(total_mes), 0),
    COUNT(DISTINCT mes_ano),
    COALESCE(
      (MAX(total_mes) - MIN(total_mes)) / NULLIF(MIN(total_mes), 0) * 100,
      0
    )
  INTO v_fat_media_mensal, v_fat_meses_activos, v_fat_crescimento
  FROM (
    SELECT
      TO_CHAR(data_emissao, 'YYYY-MM') AS mes_ano,
      SUM(total) AS total_mes
    FROM faturas
    WHERE empresa_id = p_empresa_id
      AND estado IN ('paga','emitida')
      AND data_emissao >= NOW() - INTERVAL '6 months'
    GROUP BY mes_ano
  ) sub;

  -- Pontuação faturação
  IF v_fat_media_mensal > 5000000 THEN v_score_faturacao := 120;
  ELSIF v_fat_media_mensal > 1000000 THEN v_score_faturacao := 90;
  ELSIF v_fat_media_mensal > 500000 THEN v_score_faturacao := 60;
  ELSIF v_fat_media_mensal > 100000 THEN v_score_faturacao := 30;
  ELSE v_score_faturacao := 10;
  END IF;

  -- Regularidade (meses activos dos últimos 6)
  v_score_faturacao := v_score_faturacao + (v_fat_meses_activos * 20);
  -- Crescimento
  IF v_fat_crescimento > 20 THEN v_score_faturacao := v_score_faturacao + 60;
  ELSIF v_fat_crescimento > 0 THEN v_score_faturacao := v_score_faturacao + 30;
  END IF;

  v_score_faturacao := LEAST(v_score_faturacao, 300);

  -- ── SCORE CAIXA (max 250 pts) ──
  SELECT
    COALESCE(AVG(saldo_apos), 0),
    COUNT(*) FILTER (WHERE saldo_apos > 0)
  INTO v_caixa_saldo_medio, v_caixa_meses_positivos
  FROM diario_caixa
  WHERE empresa_id = p_empresa_id
    AND data_movimento >= NOW() - INTERVAL '6 months';

  IF v_caixa_saldo_medio > 2000000 THEN v_score_caixa := 150;
  ELSIF v_caixa_saldo_medio > 500000 THEN v_score_caixa := 100;
  ELSIF v_caixa_saldo_medio > 100000 THEN v_score_caixa := 60;
  ELSIF v_caixa_saldo_medio > 0 THEN v_score_caixa := 30;
  END IF;

  v_score_caixa := LEAST(v_score_caixa + (v_caixa_meses_positivos / 6 * 100), 250);

  -- ── SCORE FINANCE (max 250 pts) ──
  SELECT
    COALESCE(SUM(valor) FILTER (WHERE tipo = 'receita'), 0),
    COALESCE(SUM(valor) FILTER (WHERE tipo = 'despesa'), 0)
  INTO v_receita_total, v_despesa_total
  FROM lancamentos
  WHERE empresa_id = p_empresa_id
    AND data_lancamento >= NOW() - INTERVAL '6 months';

  v_racio := CASE WHEN v_despesa_total > 0 THEN v_receita_total / v_despesa_total ELSE 2 END;

  IF v_racio >= 2 THEN v_score_finance := 250;
  ELSIF v_racio >= 1.5 THEN v_score_finance := 200;
  ELSIF v_racio >= 1.2 THEN v_score_finance := 150;
  ELSIF v_racio >= 1 THEN v_score_finance := 80;
  ELSE v_score_finance := 20;
  END IF;

  -- ── SCORE RH (max 200 pts) ──
  SELECT COUNT(*) INTO v_func_activos
  FROM funcionarios
  WHERE empresa_id = p_empresa_id AND activo = true;

  IF v_func_activos >= 20 THEN v_score_rh := 80;
  ELSIF v_func_activos >= 10 THEN v_score_rh := 60;
  ELSIF v_func_activos >= 5 THEN v_score_rh := 40;
  ELSIF v_func_activos >= 1 THEN v_score_rh := 20;
  END IF;

  SELECT COUNT(*) INTO v_salarios_pagos_tempo
  FROM folha_salarios
  WHERE empresa_id = p_empresa_id
    AND estado = 'pago'
    AND ano = EXTRACT(YEAR FROM NOW())::INTEGER;

  v_score_rh := LEAST(v_score_rh + (v_salarios_pagos_tempo * 15), 200);

  -- ── SCORE TOTAL ──
  v_score_total := v_score_faturacao + v_score_caixa + v_score_finance + v_score_rh;
  v_score_total := LEAST(v_score_total, 1000);

  -- ── NÍVEL ──
  v_nivel := CASE
    WHEN v_score_total >= 800 THEN 'platina'
    WHEN v_score_total >= 600 THEN 'ouro'
    WHEN v_score_total >= 400 THEN 'prata'
    ELSE 'bronze'
  END;

  v_metricas := jsonb_build_object(
    'faturacao_media_mensal', v_fat_media_mensal,
    'meses_faturacao_activos', v_fat_meses_activos,
    'crescimento_faturacao_pct', v_fat_crescimento,
    'caixa_saldo_medio', v_caixa_saldo_medio,
    'receita_6_meses', v_receita_total,
    'despesa_6_meses', v_despesa_total,
    'racio_receita_despesa', v_racio,
    'funcionarios_activos', v_func_activos,
    'salarios_pagos_ano', v_salarios_pagos_tempo
  );

  RETURN jsonb_build_object(
    'score_total', v_score_total,
    'score_faturacao', v_score_faturacao,
    'score_caixa', v_score_caixa,
    'score_finance', v_score_finance,
    'score_rh', v_score_rh,
    'nivel', v_nivel,
    'metricas', v_metricas
  );
END;
$$;

-- ───────────────────────────────────────
-- FUNÇÃO: gerar número de fatura
-- ───────────────────────────────────────
CREATE OR REPLACE FUNCTION gerar_numero_fatura(p_empresa_id UUID, p_serie TEXT DEFAULT 'A')
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  v_ano INTEGER := EXTRACT(YEAR FROM NOW())::INTEGER;
  v_seq INTEGER;
  v_numero TEXT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(numero, '/', 2) AS INTEGER)
  ), 0) + 1
  INTO v_seq
  FROM faturas
  WHERE empresa_id = p_empresa_id
    AND serie = p_serie
    AND EXTRACT(YEAR FROM data_emissao) = v_ano;

  v_numero := v_ano::TEXT || '/' || LPAD(v_seq::TEXT, 6, '0');
  RETURN v_numero;
END;
$$;
