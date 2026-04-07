'use client'

export default function AprovacoesDashboard() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Centro de Aprovações</h1>
                <div className="flex gap-2">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">3 Pendentes</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border shadow-sm">
                    <h2 className="font-semibold text-slate-700 mb-4 border-b pb-2">Pedidos de Plafond (1)</h2>
                    <div className="p-3 border rounded-md bg-slate-50 flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-800">Dep. Comercial</span>
                            <span className="text-slate-500">Hoje, 10:23</span>
                        </div>
                        <p className="text-sm text-slate-600">Aumento extraordinário para campanha de marketing Q3.</p>
                        <div className="font-bold text-indigo-600">500.000,00 AOA</div>
                        <div className="flex gap-2 mt-2">
                            <button className="flex-1 bg-emerald-500 text-white rounded py-1.5 text-xs font-medium hover:bg-emerald-600 transition">Aprovar</button>
                            <button className="flex-1 bg-slate-200 text-slate-700 rounded py-1.5 text-xs font-medium hover:bg-slate-300 transition">Rejeitar</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border shadow-sm">
                    <h2 className="font-semibold text-slate-700 mb-4 border-b pb-2">Ausências (2)</h2>
                    <div className="space-y-3">
                        <div className="p-3 border rounded-md flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-800">Carlos Mendes</p>
                                <p className="text-xs text-slate-500">Férias: 12/04 a 26/04</p>
                            </div>
                            <button className="text-emerald-600 text-sm font-medium hover:underline">Aprovar</button>
                        </div>
                        <div className="p-3 border rounded-md flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-800">Ana Beatriz</p>
                                <p className="text-xs text-slate-500">Justificada: 05/04</p>
                            </div>
                            <button className="text-emerald-600 text-sm font-medium hover:underline">Aprovar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}