'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function apurarIVAMensal(mes: number, ano: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data: util } = await supabase.from('utilizadores').select('empresa_id').eq('id', user.id).single()
    if (!util) throw new Error('Empresa não encontrada')

    const { data: faturas } = await supabase.from('faturas')
        .select('subtotal, total_iva, estado, data_emissao')
        .eq('empresa_id', util.empresa_id)
        .in('estado', ['emitida', 'paga', 'paga_parcial'])
        .gte('data_emissao', `${ano}-${mes.toString().padStart(2, '0')}-01`)
        .lt('data_emissao', `${mes === 12 ? ano + 1 : ano}-${(mes === 12 ? 1 : mes + 1).toString().padStart(2, '0')}-01`)

    const total_vendas = faturas?.reduce((acc, f) => acc + (f.subtotal || 0), 0) || 0
    const total_iva_cobrado = faturas?.reduce((acc, f) => acc + (f.total_iva || 0), 0) || 0

    const { error } = await supabase.from('declaracoes_iva').upsert({
        empresa_id: util.empresa_id,
        mes,
        ano,
        total_vendas,
        total_iva_cobrado,
        total_compras: 0,
        total_iva_dedutivel: 0,
        iva_a_pagar: total_iva_cobrado,
        estado: 'rascunho'
    }, { onConflict: 'empresa_id,mes,ano' })

    if (error) throw new Error(error.message)
    revalidatePath('/fiscalidade')
    return { sucesso: true, iva_a_pagar: total_iva_cobrado }
}
