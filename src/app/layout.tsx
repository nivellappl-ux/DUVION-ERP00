import type { Metadata } from 'next'
import { Providers } from './providers'
import '../styles/index.css'

export const metadata: Metadata = {
    title: 'Duvion ERP',
    description: 'Sistema de ERP Completo',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-AO">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
