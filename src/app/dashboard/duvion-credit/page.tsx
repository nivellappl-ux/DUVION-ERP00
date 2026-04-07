'use client'
import { useState, useEffect } from 'react'
import { calcularScoreEmpresa } from '@/lib/actions/duvion-credit'

export default function DuvionCredit() {
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        calcularScoreEmpresa().then(res => {
            if (res && res.sucesso) setData(res)
        })
    }, [])

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">DuvionCredit</h1>
                    <p className="text-slate-500 mt-1">O seu motor de pontuação e acesso a crédito</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-indigo-700 transition" onClick={() => calcularScoreEmpresa().then(res => setData(res))}>Recalcular Score</button>
            </div>

            {!data ? (
                <div className="h-64 flex items-center justify-center text-slate-400">A carregar métricas...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-white border rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Score Actual</div>
                        <div className="text-6xl font-black text-indigo-600 mb-2">{data.score.score_total}</div>
                        <div className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold uppercase tracking-widest">{data.score.nivel}</div>
                    </div>

                    <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-5 text-lg">Crédito Disponível</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                <span className="text-slate-700 font-medium">Crédito Operacional</span>
                                <span className="font-bold text-emerald-600 text-lg">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(data.creditos?.credito_operacional_disponivel || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                <span className="text-slate-700 font-medium">Crédito para Expansão</span>
                                <span className="font-bold text-emerald-600 text-lg">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(data.creditos?.credito_expansao_disponivel || 0)}</span>
                            </div>
                        </div>

                        <div className="mt-8 border-t pt-6">
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Simulador de Crescimento
                            </h4>
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                                <p className="text-sm text-indigo-900 leading-relaxed">
                                    <strong>Dica Duvion:</strong> Se registar mais dois movimentos diários de tesouraria de entradas nesta semana, o seu nível sobe para <span className="font-bold">Prata</span> e desbloqueia <span className="font-bold">1.000.000 AOA</span> em crédito para expansão.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}