'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { calcularSalarioCompleto } from '../angola/irt'

export async function processarFolhaSalarial(mes: number, ano: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Não autenticado')

    const { data: util } = await supabase.from('utilizadores').select('empresa_id').eq('id', user.id).single()
    if (!util) throw new Error('Empresa não encontrada')

    const { data: funcionarios } = await supabase.from('funcionarios')
        .select('*')
        .eq('empresa_id', util.empresa_id)
        .eq('activo', true)

    if (!funcionarios) return { sucesso: false }

    const folhas = funcionarios.map(func => {
        const calculos = calcularSalarioCompleto({
            salarioBase: func.salario_base,
            subsidioAlimentacao: func.subsidio_alimentacao,
            subsidioTransporte: func.subsidio_transporte,
            outrosSubsidios: func.outros_subsidios
        })

        return {
            empresa_id: util.empresa_id,
            funcionario_id: func.id,
            mes,
            ano,
            salario_base: func.salario_base,
            subsidio_alimentacao: func.subsidio_alimentacao,
            subsidio_transporte: func.subsidio_transporte,
            outros_subsidios: func.outros_subsidios,
            inss_trabalhador: calculos.inss,
            inss_patronal: calculos.inssPatronal,
            irt: calculos.irt,
            salario_iliquido: calculos.salarioBruto,
            total_descontos: calculos.totalDescontos,
            salario_liquido: calculos.salarioLiquido,
            estado: 'calculado'
        }
    })

    // Upsert for idempotency
    for (const folha of folhas) {
        await supabase.from('folha_salarios').upsert(folha, { onConflict: 'funcionario_id,mes,ano' })
    }

    revalidatePath('/rh')
    return { sucesso: true, processados: folhas.length }
}
