import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Exemplo de alerta CRON diário
    const { data: empresas } = await supabase.from('empresas').select('id, nome')

    for (const emp of (empresas || [])) {
        await supabase.from('duvion_credit_alertas').insert({
            empresa_id: emp.id,
            tipo: 'oportunidade',
            titulo: 'Revisão Mensal',
            mensagem: 'Prepare a sua contabilidade para a revisão mensal DuvionCredit.',
            lido: false
        })
    }

    return NextResponse.json({ success: true, processed: empresas?.length || 0 })
}
