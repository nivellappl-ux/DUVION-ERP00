'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function calcularScoreEmpresa() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { erro: 'Não autenticado' }

    const { data: util } = await supabase
        .from('utilizadores').select('empresa_id').eq('id', user.id).single()
    if (!util) return { erro: 'Empresa não encontrada' }

    // Chama a função SQL que calcula o score
    const { data: score, error } = await supabase
        .rpc('calcular_score_duvion', { p_empresa_id: util.empresa_id })
    if (error) return { erro: error.message }

    const nivel = score.nivel as string
    const creditos = calcularCreditos(score.score_total, nivel)

    // Actualiza o perfil
    await supabase.from('duvion_credit_perfis').upsert({
        empresa_id: util.empresa_id,
        score_actual: score.score_total,
        nivel: nivel,
        score_faturacao: score.score_faturacao,
        score_caixa: score.score_caixa,
        score_finance: score.score_finance,
        score_rh: score.score_rh,
        ...creditos,
        ultima_avaliacao: new Date().toISOString(),
        proxima_avaliacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }, { onConflict: 'empresa_id' })

    // Regista avaliação histórica
    await supabase.from('duvion_credit_avaliacoes').insert({
        empresa_id: util.empresa_id,
        perfil_id: (await supabase.from('duvion_credit_perfis')
            .select('id').eq('empresa_id', util.empresa_id).single()).data?.id,
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear(),
        score_total: score.score_total,
        score_faturacao: score.score_faturacao,
        score_caixa: score.score_caixa,
        score_finance: score.score_finance,
        score_rh: score.score_rh,
        nivel_novo: nivel,
        metricas_usadas: score.metricas,
        ...creditos
    })

    revalidatePath('/duvion-credit')
    return { sucesso: true, score, creditos }
}

function calcularCreditos(score: number, nivel: string) {
    const tabela: Record<string, {
        credito_operacional_disponivel: number
        credito_expansao_disponivel: number
        credito_parceiro_disponivel: number
        percentagem_desconto_mensal: number
    }> = {
        bronze: { credito_operacional_disponivel: 0, credito_expansao_disponivel: 0, credito_parceiro_disponivel: 0, percentagem_desconto_mensal: 0 },
        prata: { credito_operacional_disponivel: 500000, credito_expansao_disponivel: 1000000, credito_parceiro_disponivel: 0, percentagem_desconto_mensal: 10 },
        ouro: { credito_operacional_disponivel: 1500000, credito_expansao_disponivel: 3000000, credito_parceiro_disponivel: 2000000, percentagem_desconto_mensal: 20 },
        platina: { credito_operacional_disponivel: 5000000, credito_expansao_disponivel: 10000000, credito_parceiro_disponivel: 8000000, percentagem_desconto_mensal: 30 },
    }
    return tabela[nivel] ?? tabela.bronze
}
