'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calcularTotalFatura } from '../angola/iva'

export async function criarFatura(dadosFatura: any, itens: any[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data: util } = await supabase.from('utilizadores').select('empresa_id').eq('id', user.id).single()
    if (!util) throw new Error('Empresa não encontrada')

    const { data: numero } = await supabase.rpc('gerar_numero_fatura', { p_empresa_id: util.empresa_id })

    const calculos = calcularTotalFatura(itens.map(i => ({
        quantidade: i.quantidade,
        precoUnitario: i.precoUnitario,
        taxaIVA: i.taxaIVA,
        descontoPct: i.descontoPct || 0
    })))

    const { data: fatura, error } = await supabase.from('faturas').insert({
        empresa_id: util.empresa_id,
        numero,
        cliente_nome: dadosFatura.cliente_nome,
        cliente_nif: dadosFatura.cliente_nif,
        estado: 'emitida',
        subtotal: calculos.subtotal,
        total_desconto: calculos.totalDesconto,
        total_iva: calculos.totalIVA,
        total: calculos.total,
        valor_em_divida: calculos.total,
        criado_por: user.id
    }).select().single()

    if (error) throw new Error(error.message)

    const itensParaInserir = itens.map((item, idx) => ({
        fatura_id: fatura.id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        preco_unitario: item.precoUnitario,
        taxa_iva: item.taxaIVA,
        subtotal: calculos.linhas[idx].subtotal,
        valor_iva: calculos.linhas[idx].valorIVA,
        total: calculos.linhas[idx].total
    }))

    await supabase.from('fatura_itens').insert(itensParaInserir)

    revalidatePath('/faturacao')
    return { sucesso: true, fatura }
}
