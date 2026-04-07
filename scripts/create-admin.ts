import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function criarAdmin() {
    console.log('A criar utilizador admin...')

    // Cria o utilizador no Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'admin@duvion.ao',
        password: 'Duvion@2025#Admin',
        email_confirm: true,
        user_metadata: { nome: 'Administrador Duvion' }
    })

    if (authError) {
        console.error('Erro ao criar auth:', authError.message)
        return
    }

    console.log('Auth criado:', authData.user.id)

    // Regista na tabela utilizadores
    const { error: utilError } = await supabase.from('utilizadores').insert({
        id: authData.user.id,
        empresa_id: '00000000-0000-0000-0000-000000000001',
        nome: 'Administrador',
        email: 'admin@duvion.ao',
        cargo: 'Super Administrador',
        perfil: 'super_admin',
        activo: true
    })

    if (utilError) {
        console.error('Erro ao criar utilizador:', utilError.message)
        return
    }

    console.log('✅ Admin criado com sucesso!')
    console.log('📧 Email: admin@duvion.ao')
    console.log('🔑 Password: Duvion@2025#Admin')
}

criarAdmin()
