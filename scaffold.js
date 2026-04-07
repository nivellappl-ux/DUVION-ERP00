const fs = require('fs');
const path = require('path');

const pages = [
    { p: 'src/app/page.tsx', c: `'use client';\nimport LoginPage from '@/views/pages/LoginPage';\nexport default function Page() { return <LoginPage />; }` },
    { p: 'src/app/dashboard/layout.tsx', c: `'use client';\nimport DashboardLayout from '@/views/layouts/DashboardLayout';\nexport default function Layout({ children }: { children: React.ReactNode }) { return <DashboardLayout>{children}</DashboardLayout>; }` },
    { p: 'src/app/dashboard/page.tsx', c: `'use client';\nimport Dashboard from '@/views/pages/Dashboard';\nexport default function Page() { return <Dashboard />; }` },
    { p: 'src/app/dashboard/financeiro/page.tsx', c: `'use client';\nimport Financeiro from '@/views/pages/Financeiro';\nexport default function Page() { return <Financeiro />; }` },
    { p: 'src/app/dashboard/diario-caixa/page.tsx', c: `'use client';\nimport DiarioCaixa from '@/views/pages/DiarioCaixa';\nexport default function Page() { return <DiarioCaixa />; }` },
    { p: 'src/app/dashboard/faturacao/page.tsx', c: `'use client';\nimport Faturacao from '@/views/pages/Faturacao';\nexport default function Page() { return <Faturacao />; }` },
    { p: 'src/app/dashboard/rh/page.tsx', c: `'use client';\nimport RecursosHumanos from '@/views/pages/RecursosHumanos';\nexport default function Page() { return <RecursosHumanos />; }` },
    { p: 'src/app/dashboard/fiscalidade/page.tsx', c: `'use client';\nimport Fiscalidade from '@/views/pages/Fiscalidade';\nexport default function Page() { return <Fiscalidade />; }` },
    { p: 'src/app/dashboard/conta-bancaria/page.tsx', c: `'use client';\nimport ContaBancaria from '@/views/pages/ContaBancaria';\nexport default function Page() { return <ContaBancaria />; }` },
    { p: 'src/app/dashboard/plafond/page.tsx', c: `'use client';\nimport Plafond from '@/views/pages/Plafond';\nexport default function Page() { return <Plafond />; }` },
    { p: 'src/app/dashboard/tesouraria/page.tsx', c: `'use client';\nimport Tesouraria from '@/views/pages/Tesouraria';\nexport default function Page() { return <Tesouraria />; }` },
    { p: 'src/app/dashboard/estoque/page.tsx', c: `'use client';\nimport Estoque from '@/views/pages/Estoque';\nexport default function Page() { return <Estoque />; }` },
    { p: 'src/app/dashboard/configuracoes/page.tsx', c: `'use client';\nimport Configuracoes from '@/views/pages/Configuracoes';\nexport default function Page() { return <Configuracoes />; }` },
    { p: 'src/app/dashboard/duvion-credit/page.tsx', c: `'use client';\nexport default function Page() { return <div className="p-6"><h1>Duvion Credit</h1><p>Funcionalidade baseada em Score de Crédito</p></div>; }` },
    { p: 'src/app/dashboard/aprovacoes/page.tsx', c: `'use client';\nexport default function Page() { return <div className="p-6"><h1>Aprovações</h1><p>Dashboard de aprovações em construção</p></div>; }` },
    { p: 'src/app/verificar/[codigo]/page.tsx', c: `'use client';\nexport default function Page({params}: any) { return <div className="p-6"><h1>Certificado Duvion</h1><p>Verificação pública: {params.codigo}</p></div>; }` },
];

pages.forEach(x => {
    fs.mkdirSync(path.dirname(x.p), { recursive: true });
    if (!fs.existsSync(x.p)) {
        fs.writeFileSync(x.p, x.c);
    }
});
