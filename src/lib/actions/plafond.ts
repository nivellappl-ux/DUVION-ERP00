'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function solicitarPlafond(departamento_id: string, periodo_id: string, valor: number, descricao: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data: util } = await supabase.from('utilizadores').select('empresa_id').eq('id', user.id).single()
    if (!util) throw new Error('Empresa não encontrada')

    const { error } = await supabase.from('plafond_pedidos').insert({
        empresa_id: util.empresa_id,
        departamento_id,
        periodo_id,
        solicitado_por: user.id,
        valor_pedido: valor,
        descricao,
        estado: 'pendente'
    })

    if (error) throw new Error(error.message)
    revalidatePath('/plafond')
    return { sucesso: true }
}

export async function aprovarPlafond(pedido_id: string, valor_aprovado: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { error } = await supabase.from('plafond_pedidos').update({
        estado: 'aprovado',
        aprovado_por: user.id,
        aprovado_em: new Date().toISOString(),
        valor_aprovado
    }).eq('id', pedido_id)

    if (error) throw new Error(error.message)
    revalidatePath('/plafond')
    return { sucesso: true }
}
