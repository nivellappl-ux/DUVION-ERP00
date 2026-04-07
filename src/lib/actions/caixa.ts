'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function registarMovimentoCaixa(data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data: util } = await supabase.from('utilizadores').select('empresa_id').eq('id', user.id).single()
    if (!util) throw new Error('Empresa não encontrada')

    const { data: saldo } = await supabase.from('saldo_caixa').select('saldo_actual').eq('empresa_id', util.empresa_id).maybeSingle()
    const saldoAnterior = saldo?.saldo_actual || 0
    const valorNum = parseFloat(data.valor)
    const saldoApos = data.tipo === 'entrada' ? saldoAnterior + valorNum : saldoAnterior - valorNum

    const { error } = await supabase.from('diario_caixa').insert({
        empresa_id: util.empresa_id,
        tipo: data.tipo,
        descricao: data.descricao,
        valor: valorNum,
        saldo_anterior: saldoAnterior,
        saldo_apos: saldoApos,
        metodo: data.metodo || 'dinheiro',
        criado_por: user.id
    })

    if (error) throw new Error(error.message)

    if (data.registarFinance) {
        await supabase.from('lancamentos').insert({
            empresa_id: util.empresa_id,
            tipo: data.tipo === 'entrada' ? 'receita' : 'despesa',
            descricao: data.descricao,
            valor: valorNum,
            metodo_pagamento: data.metodo || 'dinheiro',
            estado: 'confirmado',
            criado_por: user.id
        })
    }

    revalidatePath('/caixa')
    return { sucesso: true }
}
