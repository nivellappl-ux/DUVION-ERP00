'use client'

export default function CertificatePage({ params }: { params: any }) {
    const { codigo } = params;
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-center p-8 space-y-6 border border-slate-100">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Empresa Certificada</h1>
                    <p className="text-slate-500 mt-1">DuvionCredit Verified Partner</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">CÓDIGO DE CERTIFICADO</div>
                    <div className="font-mono text-lg text-slate-800">{codigo}</div>
                </div>

                <div className="pt-4 flex justify-between border-t border-slate-100">
                    <div className="text-left">
                        <div className="text-xs text-slate-400">STATUS</div>
                        <div className="font-semibold text-emerald-600">Activo e Válido</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400">DATA</div>
                        <div className="font-semibold text-slate-700">{new Date().toLocaleDateString('pt-AO')}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}