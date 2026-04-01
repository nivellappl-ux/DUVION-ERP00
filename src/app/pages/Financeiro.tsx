import { useState } from "react";
import {
  TrendingUp, TrendingDown, DollarSign, Filter, Search, Download, Plus, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { KPICard } from "../components/shared/KPICard";
import { PageHeader } from "../components/shared/PageHeader";
import { SectionCard } from "../components/shared/SectionCard";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";

const chartData = [
  { month: "Out", receitas: 42000000, despesas: 31000000 },
  { month: "Nov", receitas: 48000000, despesas: 35000000 },
  { month: "Dez", receitas: 55000000, despesas: 38000000 },
  { month: "Jan", receitas: 45000000, despesas: 32000000 },
  { month: "Fev", receitas: 52000000, despesas: 36000000 },
  { month: "Mar", receitas: 67000000, despesas: 44000000 },
];

const receitas = [
  { id: "REC-2025/0087", descricao: "Serviços de Consultoria — Sonangol", data: "28/03/2025", valor: 12500000, categoria: "Serviços", estado: "Recebido" },
  { id: "REC-2025/0086", descricao: "Venda de Equipamentos — Unitel", data: "25/03/2025", valor: 8750000, categoria: "Vendas", estado: "Pendente" },
  { id: "REC-2025/0085", descricao: "Contrato de Manutenção — BAI", data: "22/03/2025", valor: 15200000, categoria: "Serviços", estado: "Recebido" },
  { id: "REC-2025/0084", descricao: "Consultoria Técnica — TAAG", data: "18/03/2025", valor: 9800000, categoria: "Serviços", estado: "Recebido" },
  { id: "REC-2025/0083", descricao: "Fornecimento de Software — Angola Telecom", data: "15/03/2025", valor: 6300000, categoria: "Licenças", estado: "Recebido" },
];

const despesas = [
  { id: "DES-2025/0043", descricao: "Salários — Março 2025", data: "31/03/2025", valor: 11900000, categoria: "RH", estado: "Pago" },
  { id: "DES-2025/0042", descricao: "INSS Empregador — Março", data: "30/03/2025", valor: 952000, categoria: "Impostos", estado: "Pago" },
  { id: "DES-2025/0041", descricao: "Aluguel Escritório — Abril", data: "01/04/2025", valor: 2500000, categoria: "Infraestrutura", estado: "Pendente" },
  { id: "DES-2025/0040", descricao: "Fornecedor — Electro Services", data: "02/04/2025", valor: 8500000, categoria: "Fornecedores", estado: "Pendente" },
  { id: "DES-2025/0039", descricao: "Material de Escritório", data: "20/03/2025", valor: 450000, categoria: "Administrativo", estado: "Pago" },
];

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 0 }).format(v);

const categoriaColors: Record<string, string> = {
  Serviços: "var(--primary)",
  Vendas: "#10B981",
  Licenças: "#3B82F6",
  RH: "#8B5CF6",
  Impostos: "#EF4444",
  Infraestrutura: "#F59E0B",
  Fornecedores: "#EC4899",
  Administrativo: "#6B7280",
};

export default function Financeiro() {
  const [activeTab, setActiveTab] = useState<"receitas" | "despesas">("receitas");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"data" | "valor">("data");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const totalReceitas = receitas.reduce((s, r) => s + r.valor, 0);
  const totalDespesas = despesas.reduce((s, d) => s + d.valor, 0);
  const lucro = totalReceitas - totalDespesas;
  const margem = ((lucro / totalReceitas) * 100).toFixed(1);

  const data = activeTab === "receitas" ? receitas : despesas;
  const filteredData = data
    .filter((r) =>
      r.descricao.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.categoria.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "valor") return sortDir === "asc" ? a.valor - b.valor : b.valor - a.valor;
      return sortDir === "asc"
        ? a.data.localeCompare(b.data)
        : b.data.localeCompare(a.data);
    });

  const toggleSort = (field: "data" | "valor") => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        icon={TrendingUp}
        title="Financeiro"
        subtitle="Controlo de receitas e despesas"
        actions={
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: "13px" }}
          >
            <Plus size={16} />
            Novo Lançamento
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Receitas (Mar)" value={`${(totalReceitas / 1000000).toFixed(1)}M AOA`} icon={ArrowUpRight} change="+12.5%" trend="up" />
        <KPICard title="Despesas (Mar)" value={`${(totalDespesas / 1000000).toFixed(1)}M AOA`} icon={ArrowDownRight} change="+4.1%" trend="down" />
        <KPICard title="Resultado Líquido" value={`${(lucro / 1000000).toFixed(1)}M AOA`} icon={DollarSign} change="+22.3%" trend="up" accent />
        <KPICard title="Margem Operacional" value={`${margem}%`} icon={TrendingUp} change="+3.2pp" trend="up" />
      </div>

      {/* Chart */}
      <SectionCard
        title="Receitas vs Despesas — Últimos 6 Meses"
        subtitle="Valores em AOA"
        actions={
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs" style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}>
            <Download size={13} /> Exportar
          </button>
        }
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2422" />
              <XAxis dataKey="month" stroke="#9A9A9A" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9A9A9A" tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2422", borderRadius: "8px", color: "#F5F5F5" }}
                formatter={(value: number, name: string) => [`${(value / 1000000).toFixed(1)}M AOA`, name === "receitas" ? "Receitas" : "Despesas"]}
              />
              <Legend formatter={(v) => v === "receitas" ? "Receitas" : "Despesas"} />
              <Area type="monotone" dataKey="receitas" stroke="#2563EB" strokeWidth={2} fill="url(#colorReceitas)" name="receitas" />
              <Area type="monotone" dataKey="despesas" stroke="#EF4444" strokeWidth={2} fill="url(#colorDespesas)" name="despesas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Tab Table */}
      <SectionCard
        title=""
        noPadding
        actions={undefined}
      >
        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: "#2A2422" }}>
          {(["receitas", "despesas"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-6 py-4 transition-colors relative capitalize"
              style={{
                color: activeTab === tab ? "var(--primary)" : "var(--text-secondary)",
                fontWeight: activeTab === tab ? 600 : 500,
                fontSize: "14px",
              }}
            >
              {tab === "receitas" ? (
                <span className="flex items-center gap-2"><ArrowUpRight size={15} />Receitas</span>
              ) : (
                <span className="flex items-center gap-2"><ArrowDownRight size={15} />Despesas</span>
              )}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "var(--primary)" }} />
              )}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 px-4">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9A9A9A" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar..."
                className="pl-8 pr-3 py-1.5 rounded border text-sm focus:outline-none"
                style={{ backgroundColor: "#0F0F0F", borderColor: "#2A2422", color: "#F5F5F5", width: "180px", fontSize: "13px" }}
              />
            </div>
            <button className="p-1.5 rounded" style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}>
              <Filter size={14} />
            </button>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <EmptyState
            icon={TrendingDown}
            title="Sem resultados"
            description="Não foram encontrados lançamentos correspondentes à pesquisa."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Referência</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Descrição</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Categoria</th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}
                    onClick={() => toggleSort("data")}
                  >
                    Data {sortField === "data" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th
                    className="text-right px-4 py-3 cursor-pointer"
                    style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}
                    onClick={() => toggleSort("valor")}
                  >
                    Valor {sortField === "valor" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th className="text-center px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, i) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#1F1F1F] transition-colors"
                    style={{ backgroundColor: i % 2 === 0 ? "#1A1A1A" : "#141414" }}
                  >
                    <td className="px-4 py-3" style={{ color: "var(--primary)", fontSize: "13px", fontWeight: 500 }}>{row.id}</td>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{row.descricao}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${categoriaColors[row.categoria] || "#6B7280"}20`,
                          color: categoriaColors[row.categoria] || "#6B7280",
                          fontWeight: 600,
                        }}
                      >
                        {row.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "13px" }}>{row.data}</td>
                    <td className="px-4 py-3 text-right" style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "13px" }}>
                      {fmt(row.valor)} AOA
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={row.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid #2A2422" }}>
                  <td colSpan={4} className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "13px" }}>
                    {filteredData.length} registo{filteredData.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 text-right" style={{ color: "var(--primary)", fontWeight: 700, fontSize: "14px" }}>
                    {fmt(filteredData.reduce((s, r) => s + r.valor, 0))} AOA
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}