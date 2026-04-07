import { useState } from "react";
import {
  Users,
  Search,
  X,
  Plus,
  Download,
  Filter,
  UserCheck,
  DollarSign,
  Shield,
  TrendingDown,
  ChevronRight,
  Edit2,
} from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { SectionCard } from "../components/shared/SectionCard";
import { KPICard } from "../components/shared/KPICard";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

interface Employee {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  salarioBase: number;
  estado: "Ativo" | "Inativo" | "Licença";
  dataAdmissao: string;
  avatar: string;
  email: string;
  telefone: string;
  inss: "Regular" | "Irregular";
  nif: string;
}

const employees: Employee[] = [
  { id: "1", nome: "João Silva", cargo: "Diretor Geral", departamento: "Direção", salarioBase: 4500000, estado: "Ativo", dataAdmissao: "15/01/2020", avatar: "JS", email: "joao.silva@duvion.ao", telefone: "+244 923 000 001", inss: "Regular", nif: "004123456TA000" },
  { id: "2", nome: "Maria Santos", cargo: "Contabilista Sénior", departamento: "Financeiro", salarioBase: 1200000, estado: "Ativo", dataAdmissao: "03/03/2021", avatar: "MS", email: "maria.santos@duvion.ao", telefone: "+244 923 000 002", inss: "Regular", nif: "004234567TA000" },
  { id: "3", nome: "Pedro Costa", cargo: "Técnico de TI", departamento: "Tecnologia", salarioBase: 850000, estado: "Ativo", dataAdmissao: "10/07/2021", avatar: "PC", email: "pedro.costa@duvion.ao", telefone: "+244 923 000 003", inss: "Regular", nif: "004345678TA000" },
  { id: "4", nome: "Ana Mendes", cargo: "Gestora de RH", departamento: "RH", salarioBase: 1500000, estado: "Ativo", dataAdmissao: "22/05/2020", avatar: "AM", email: "ana.mendes@duvion.ao", telefone: "+244 923 000 004", inss: "Regular", nif: "004456789TA000" },
  { id: "5", nome: "Carlos Fernandes", cargo: "Comercial Sénior", departamento: "Comercial", salarioBase: 650000, estado: "Ativo", dataAdmissao: "01/09/2022", avatar: "CF", email: "carlos.fernandes@duvion.ao", telefone: "+244 923 000 005", inss: "Regular", nif: "004567890TA000" },
  { id: "6", nome: "Beatriz Lopes", cargo: "Gestora de Marketing", departamento: "Marketing", salarioBase: 950000, estado: "Licença", dataAdmissao: "15/11/2021", avatar: "BL", email: "beatriz.lopes@duvion.ao", telefone: "+244 923 000 006", inss: "Regular", nif: "004678901TA000" },
  { id: "7", nome: "Ricardo Gomes", cargo: "Operador", departamento: "Operações", salarioBase: 450000, estado: "Ativo", dataAdmissao: "20/02/2023", avatar: "RG", email: "ricardo.gomes@duvion.ao", telefone: "+244 923 000 007", inss: "Regular", nif: "004789012TA000" },
  { id: "8", nome: "Sofia Rodrigues", cargo: "Jurista Sénior", departamento: "Jurídico", salarioBase: 1800000, estado: "Ativo", dataAdmissao: "08/04/2020", avatar: "SR", email: "sofia.rodrigues@duvion.ao", telefone: "+244 923 000 008", inss: "Regular", nif: "004890123TA000" },
];

const departments = ["Todos", "Direção", "Financeiro", "Tecnologia", "RH", "Comercial", "Marketing", "Operações", "Jurídico"];

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 0 }).format(v);

// ─── IRT Calculation ──────────────────────────────────────────────────────────

function calcIRT(salarioBruto: number): number {
  const escaloes = [
    { min: 0, max: 34450, taxa: 0, parcela: 0 },
    { min: 34451, max: 35000, taxa: 0.10, parcela: 3445 },
    { min: 35001, max: 40000, taxa: 0.13, parcela: 4496 },
    { min: 40001, max: 45000, taxa: 0.16, parcela: 5696 },
    { min: 45001, max: 50000, taxa: 0.18, parcela: 6596 },
    { min: 50001, max: 70000, taxa: 0.19, parcela: 7096 },
    { min: 70001, max: Infinity, taxa: 0.25, parcela: 11296 },
  ];
  for (const e of escaloes) {
    if (salarioBruto <= e.max) {
      return Math.max(0, salarioBruto * e.taxa - e.parcela);
    }
  }
  return 0;
}

function calcSalario(salarioBase: number) {
  const inssEmp = Math.round(salarioBase * 0.03);
  const irt = Math.round(calcIRT(salarioBase));
  const liquido = salarioBase - inssEmp - irt;
  const inssEmpr = Math.round(salarioBase * 0.08);
  return { inssEmp, inssEmpr, irt, liquido, custoTotal: salarioBase + inssEmpr };
}

// ─── Estado Badge ─────────────────────────────────────────────────────────────

const estadoStyle: Record<string, { bg: string; text: string }> = {
  Ativo:   { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  Inativo: { bg: "rgba(107,114,128,0.15)", text: "#6B7280" },
  Licença: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
};

// ─── Employee Detail Panel ────────────────────────────────────────────────────

function EmployeePanel({ emp, onClose }: { emp: Employee; onClose: () => void }) {
  const sal = calcSalario(emp.salarioBase);
  const e = estadoStyle[emp.estado];
  return (
    <div
      className="w-80 xl:w-96 flex-shrink-0 rounded-lg overflow-hidden"
      style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2422" }}
    >
      {/* Panel Header */}
      <div className="p-5 border-b" style={{ borderColor: "#2A2422" }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "18px" }}
            >
              {emp.avatar}
            </div>
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "16px" }}>{emp.nome}</p>
              <p style={{ color: "#9A9A9A", fontSize: "12px" }}>{emp.cargo}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: e.bg, color: e.text, fontWeight: 600 }}>
                {emp.estado}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[#2A2422] transition-colors">
            <X size={15} style={{ color: "#9A9A9A" }} />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
        {/* Info */}
        <div className="grid grid-cols-1 gap-3">
          {[
            { label: "Departamento", value: emp.departamento },
            { label: "NIF", value: emp.nif },
            { label: "Email", value: emp.email },
            { label: "Telefone", value: emp.telefone },
            { label: "Data de Admissão", value: emp.dataAdmissao },
          ].map((f) => (
            <div key={f.label} className="flex justify-between items-center py-1.5 border-b" style={{ borderColor: "#2A2422" }}>
              <span style={{ color: "#9A9A9A", fontSize: "12px" }}>{f.label}</span>
              <span style={{ color: "#F5F5F5", fontSize: "12px", fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{f.value}</span>
            </div>
          ))}
        </div>

        {/* Salary Breakdown */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: "#0F0F0F" }}>
          <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "12px", marginBottom: "12px" }}>
            FOLHA SALARIAL — MARÇO 2025
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ color: "#9A9A9A", fontSize: "12px" }}>Salário Base</span>
              <span style={{ color: "#F5F5F5", fontSize: "12px", fontWeight: 600 }}>{fmt(emp.salarioBase)} AOA</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#9A9A9A", fontSize: "12px" }}>INSS Empregado (3%)</span>
              <span style={{ color: "#EF4444", fontSize: "12px" }}>- {fmt(sal.inssEmp)} AOA</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#9A9A9A", fontSize: "12px" }}>IRT Retido</span>
              <span style={{ color: "#EF4444", fontSize: "12px" }}>- {fmt(sal.irt)} AOA</span>
            </div>
            <div className="flex justify-between pt-2 border-t" style={{ borderColor: "#2A2422" }}>
              <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "13px" }}>Salário Líquido</span>
              <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "15px" }}>{fmt(sal.liquido)} AOA</span>
            </div>
            <div className="flex justify-between pt-2 border-t" style={{ borderColor: "#2A2422" }}>
              <span style={{ color: "#9A9A9A", fontSize: "11px" }}>INSS Empregador (8%)</span>
              <span style={{ color: "#9A9A9A", fontSize: "11px" }}>{fmt(sal.inssEmpr)} AOA</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#9A9A9A", fontSize: "11px" }}>Custo Total Empresa</span>
              <span style={{ color: "#9A9A9A", fontSize: "11px" }}>{fmt(sal.custoTotal)} AOA</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--primary)", color: "#0F0F0F", fontWeight: 600 }}
          >
            <Download size={14} /> Gerar Recibo de Salário
          </button>
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm transition-colors hover:bg-[#2A2422]"
            style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}
          >
            <Edit2 size={14} /> Editar Funcionário
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type ViewTab = "funcionarios" | "processamento";

export default function RecursosHumanos() {
  const [selectedDept, setSelectedDept] = useState("Todos");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ViewTab>("funcionarios");

  const ativos = employees.filter((e) => e.estado === "Ativo");
  const totalFolha = employees.reduce((s, e) => s + e.salarioBase, 0);
  const totalINSS = employees.reduce((s, e) => s + calcSalario(e.salarioBase).inssEmpr, 0);
  const totalIRT = employees.reduce((s, e) => s + calcSalario(e.salarioBase).irt, 0);
  const totalCusto = employees.reduce((s, e) => s + calcSalario(e.salarioBase).custoTotal, 0);

  const filtered = employees.filter((emp) => {
    const matchDept = selectedDept === "Todos" || emp.departamento === selectedDept;
    const matchSearch =
      emp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        icon={Users}
        title="Recursos Humanos"
        subtitle="Gestão de pessoal · INSS · IRT — Março 2025"
        actions={
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs transition-colors"
              style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}
            >
              <Download size={13} /> Exportar
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#C9A84C", color: "#0F0F0F", fontWeight: 600, fontSize: "13px" }}
            >
              <Plus size={15} /> Novo Funcionário
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Funcionários Ativos" value={String(ativos.length)} icon={UserCheck} change={`+${ativos.length - 6} este ano`} trend="up" />
        <KPICard title="Folha Salarial (Mar)" value={`${(totalFolha / 1000000).toFixed(1)}M AOA`} icon={DollarSign} change="+3.2%" trend="up" accent />
        <KPICard title="INSS Empregador (8%)" value={`${(totalINSS / 1000000).toFixed(2)}M AOA`} icon={Shield} subtitle="Vence dia 10/04" />
        <KPICard title="IRT Total Retido" value={`${(totalIRT / 1000000).toFixed(2)}M AOA`} icon={TrendingDown} subtitle="Vence dia 10/04" />
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: "#2A2422" }}>
        {(["funcionarios", "processamento"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-3 relative transition-colors"
            style={{
              color: activeTab === tab ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: activeTab === tab ? 600 : 500,
              fontSize: "13px",
            }}
          >
            {tab === "funcionarios" ? "Funcionários" : "Processamento Salarial"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "var(--primary)" }} />
            )}
          </button>
        ))}
      </div>

      {/* ── FUNCIONÁRIOS TAB ─────────────────────────────── */}
      {activeTab === "funcionarios" && (
        <div className="flex gap-5">
          {/* Left: List */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Search & Dept Filter */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9A9A9A" }} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar funcionário, cargo…"
                  className="w-full pl-9 pr-3 py-2 rounded border text-sm focus:outline-none"
                  style={{ backgroundColor: "#1A1A1A", borderColor: "#2A2422", color: "#F5F5F5" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
              <button className="p-2 rounded" style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}>
                <Filter size={14} />
              </button>
            </div>

            {/* Dept chips */}
            <div className="flex gap-2 flex-wrap">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className="px-3 py-1 rounded-full text-xs transition-colors"
                  style={{
                    backgroundColor: selectedDept === dept ? "var(--primary)" : "var(--surface)",
                    color: selectedDept === dept ? "#fff" : "var(--text-secondary)",
                    fontWeight: selectedDept === dept ? 700 : 500,
                    border: selectedDept === dept ? "1px solid var(--primary)" : "1px solid var(--border)",
                  }}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#1A1A1A" }}>
              {filtered.length === 0 ? (
                <EmptyState icon={Users} title="Sem funcionários" description="Não foram encontrados funcionários com os filtros actuais." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                        <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Funcionário</th>
                        <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Cargo</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Departamento</th>
                        <th className="text-right px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Salário Base</th>
                        <th className="text-center px-4 py-3 hidden lg:table-cell" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>INSS</th>
                        <th className="text-center px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Estado</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((emp, i) => {
                        const e = estadoStyle[emp.estado];
                        const isSelected = selectedEmployee?.id === emp.id;
                        return (
                          <tr
                            key={emp.id}
                            className="cursor-pointer transition-colors hover:bg-[#2A2422]"
                            style={{ backgroundColor: isSelected ? "#2A2422" : i % 2 === 0 ? "#1A1A1A" : "#141414" }}
                            onClick={() => setSelectedEmployee(isSelected ? null : emp)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: isSelected ? "var(--primary)" : "var(--icon-bg)", color: isSelected ? "#fff" : "var(--primary)", fontWeight: 700, fontSize: "11px" }}
                                >
                                  {emp.avatar}
                                </div>
                                <span style={{ color: "#F5F5F5", fontSize: "13px", fontWeight: 500 }}>{emp.nome}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px" }}>{emp.cargo}</td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "#2A2422", color: "#9A9A9A" }}>
                                {emp.departamento}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right" style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "13px" }}>
                              {fmt(emp.salarioBase)}
                              <span style={{ color: "#9A9A9A", fontWeight: 400 }}> AOA</span>
                            </td>
                            <td className="px-4 py-3 text-center hidden lg:table-cell">
                              <StatusBadge status={emp.inss} />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: e.bg, color: e.text, fontWeight: 600 }}>
                                {emp.estado}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <ChevronRight size={14} style={{ color: isSelected ? "var(--primary)" : "var(--text-muted)" }} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: "2px solid #2A2422" }}>
                        <td colSpan={3} className="px-4 py-2.5" style={{ color: "#9A9A9A", fontSize: "12px" }}>
                          {filtered.length} funcionário{filtered.length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-4 py-2.5 text-right" style={{ color: "var(--primary)", fontWeight: 700, fontSize: "13px" }}>
                          {fmt(filtered.reduce((s, e) => s + e.salarioBase, 0))} AOA
                        </td>
                        <td colSpan={3} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right: Employee Detail Panel */}
          {selectedEmployee && (
            <EmployeePanel
              emp={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
            />
          )}
        </div>
      )}

      {/* ── PROCESSAMENTO SALARIAL TAB ────────────────────── */}
      {activeTab === "processamento" && (
        <SectionCard
          title="Processamento Salarial — Março 2025"
          subtitle="Todos os valores calculados com INSS 3%/8% e IRT por escalão"
          noPadding
          actions={
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--primary)", color: "#0F0F0F", fontWeight: 600 }}
            >
              <Download size={13} /> Exportar Folha
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                  {[
                    "Funcionário",
                    "Departamento",
                    "Salário Base",
                    "INSS Emp. (3%)",
                    "IRT",
                    "Salário Líquido",
                    "INSS Empr. (8%)",
                    "Custo Total",
                  ].map((h) => (
                    <th key={h} className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => {
                  const sal = calcSalario(emp.salarioBase);
                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-[#1F1F1F] transition-colors"
                      style={{ backgroundColor: i % 2 === 0 ? "#1A1A1A" : "#141414" }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "9px" }}
                          >
                            {emp.avatar}
                          </div>
                          <span style={{ color: "#F5F5F5", fontSize: "12px", fontWeight: 500 }}>{emp.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px" }}>{emp.departamento}</td>
                      <td className="px-4 py-3" style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "12px" }}>{fmt(emp.salarioBase)}</td>
                      <td className="px-4 py-3" style={{ color: "#EF4444", fontSize: "12px" }}>- {fmt(sal.inssEmp)}</td>
                      <td className="px-4 py-3" style={{ color: "#EF4444", fontSize: "12px" }}>- {fmt(sal.irt)}</td>
                      <td className="px-4 py-3" style={{ color: "#10B981", fontWeight: 700, fontSize: "12px" }}>{fmt(sal.liquido)}</td>
                      <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px" }}>{fmt(sal.inssEmpr)}</td>
                      <td className="px-4 py-3" style={{ color: "var(--primary)", fontWeight: 700, fontSize: "12px" }}>{fmt(sal.custoTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid var(--primary)" }}>
                  <td colSpan={2} className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px", fontWeight: 600 }}>
                    TOTAL ({employees.length} funcionários)
                  </td>
                  <td className="px-4 py-3" style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "12px" }}>{fmt(totalFolha)}</td>
                  <td className="px-4 py-3" style={{ color: "#EF4444", fontWeight: 700, fontSize: "12px" }}>
                    {fmt(employees.reduce((s, e) => s + calcSalario(e.salarioBase).inssEmp, 0))}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#EF4444", fontWeight: 700, fontSize: "12px" }}>{fmt(totalIRT)}</td>
                  <td className="px-4 py-3" style={{ color: "#10B981", fontWeight: 700, fontSize: "12px" }}>
                    {fmt(employees.reduce((s, e) => s + calcSalario(e.salarioBase).liquido, 0))}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#9A9A9A", fontWeight: 700, fontSize: "12px" }}>{fmt(totalINSS)}</td>
                  <td className="px-4 py-3" style={{ color: "var(--primary)", fontWeight: 700, fontSize: "13px" }}>{fmt(totalCusto)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {/* Summary */}
          <div
            className="px-5 py-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4"
            style={{ borderColor: "#2A2422" }}
          >
            {[
              { label: "Total a Pagar (Líquidos)", value: fmt(employees.reduce((s, e) => s + calcSalario(e.salarioBase).liquido, 0)) + " AOA", color: "#10B981" },
              { label: "INSS Total (Emp. + Empr.)", value: fmt(employees.reduce((s, e) => s + calcSalario(e.salarioBase).inssEmp, 0) + totalINSS) + " AOA", color: "#8B5CF6" },
              { label: "IRT Total Retido", value: fmt(totalIRT) + " AOA", color: "var(--primary)" },
              { label: "Custo Total Empresa", value: fmt(totalCusto) + " AOA", color: "#F5F5F5" },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ color: "#9A9A9A", fontSize: "11px" }}>{item.label}</p>
                <p style={{ color: item.color, fontWeight: 700, fontSize: "14px", marginTop: "2px" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}