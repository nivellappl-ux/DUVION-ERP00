import { useState } from "react";
import { BookOpen, Plus, Search, ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle, Printer } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { SectionCard } from "../components/shared/SectionCard";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";

interface CashEntry {
  id: string;
  hora: string;
  descricao: string;
  referencia: string;
  tipo: "Entrada" | "Saída";
  valor: number;
  saldo: number;
  responsavel: string;
}

const EXCHANGE_RATE = 850;

const initialEntries: CashEntry[] = [
  { id: "DC-0045", hora: "08:30", descricao: "Saldo inicial do dia", referencia: "—", tipo: "Entrada", valor: 0, saldo: 5200000, responsavel: "Sistema" },
  { id: "DC-0046", hora: "09:15", descricao: "Recebimento fatura FT 2025/241 — TAAG", referencia: "FT 2025/241", tipo: "Entrada", valor: 9800000, saldo: 15000000, responsavel: "Maria Santos" },
  { id: "DC-0047", hora: "10:00", descricao: "Pagamento de Material de Escritório", referencia: "DES-2025/0039", tipo: "Saída", valor: 450000, saldo: 14550000, responsavel: "Pedro Costa" },
  { id: "DC-0048", hora: "11:30", descricao: "Recebimento fatura FT 2025/243 — BAI", referencia: "FT 2025/243", tipo: "Entrada", valor: 15200000, saldo: 29750000, responsavel: "Maria Santos" },
  { id: "DC-0049", hora: "14:00", descricao: "Adiantamento de despesa — Transporte", referencia: "—", tipo: "Saída", valor: 120000, saldo: 29630000, responsavel: "João Silva" },
  { id: "DC-0050", hora: "15:45", descricao: "Pagamento parcial fornecedor — Electro", referencia: "DES-2025/0040", tipo: "Saída", valor: 3000000, saldo: 26630000, responsavel: "Ana Mendes" },
  { id: "DC-0051", hora: "16:20", descricao: "Recebimento serviços — Sonangol", referencia: "FT 2025/245", tipo: "Entrada", valor: 12500000, saldo: 39130000, responsavel: "Maria Santos" },
];

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 0 }).format(v);

const DATES = ["29/03/2025", "30/03/2025", "31/03/2025"];

export default function DiarioCaixa() {
  const [dateIndex, setDateIndex] = useState(2);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    descricao: "",
    referencia: "",
    tipo: "Entrada" as "Entrada" | "Saída",
    valor: "",
    responsavel: "",
  });

  const currentDate = DATES[dateIndex];
  const entries = initialEntries;
  const totalEntradas = entries.filter((e) => e.tipo === "Entrada").reduce((s, e) => s + e.valor, 0);
  const totalSaidas = entries.filter((e) => e.tipo === "Saída").reduce((s, e) => s + e.valor, 0);
  const saldoFinal = entries[entries.length - 1]?.saldo || 0;

  const filtered = entries.filter(
    (e) =>
      e.descricao.toLowerCase().includes(search.toLowerCase()) ||
      e.referencia.toLowerCase().includes(search.toLowerCase()) ||
      e.responsavel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        icon={BookOpen}
        title="Diário de Caixa"
        subtitle={`Movimentos do dia ${currentDate}`}
        actions={
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md" style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}>
              <Printer size={16} />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: "13px" }}
            >
              <Plus size={15} />
              Novo Movimento
            </button>
          </div>
        }
      />

      {/* Date Navigator */}
      <div
        className="flex items-center justify-between p-4 rounded-lg"
        style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2422" }}
      >
        <button
          onClick={() => setDateIndex(Math.max(0, dateIndex - 1))}
          disabled={dateIndex === 0}
          className="p-2 rounded-md transition-colors hover:bg-[#2A2422] disabled:opacity-30"
          style={{ color: "#9A9A9A" }}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "18px" }}>{currentDate}</p>
          <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Terça-feira</p>
        </div>
        <button
          onClick={() => setDateIndex(Math.min(DATES.length - 1, dateIndex + 1))}
          disabled={dateIndex === DATES.length - 1}
          className="p-2 rounded-md transition-colors hover:bg-[#2A2422] disabled:opacity-30"
          style={{ color: "#9A9A9A" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpCircle size={16} style={{ color: "#10B981" }} />
            <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Total Entradas</p>
          </div>
          <p style={{ color: "#10B981", fontWeight: 700, fontSize: "22px" }}>{fmt(totalEntradas)}</p>
          <p style={{ color: "#9A9A9A", fontSize: "11px", marginTop: "2px" }}>AOA</p>
        </div>
        <div className="p-5 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownCircle size={16} style={{ color: "#EF4444" }} />
            <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Total Saídas</p>
          </div>
          <p style={{ color: "#EF4444", fontWeight: 700, fontSize: "22px" }}>{fmt(totalSaidas)}</p>
          <p style={{ color: "#9A9A9A", fontSize: "11px", marginTop: "2px" }}>AOA</p>
        </div>
        <div className="p-5 rounded-lg" style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(37,99,235,0.25)" }}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} style={{ color: "var(--primary)" }} />
            <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Saldo Final</p>
          </div>
          <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "22px" }}>{fmt(saldoFinal)}</p>
          <p style={{ color: "#9A9A9A", fontSize: "11px", marginTop: "2px" }}>
            ≈ {fmt(Math.round(saldoFinal / EXCHANGE_RATE))} USD
          </p>
        </div>
      </div>

      {/* Journal Table */}
      <SectionCard
        title="Movimentos"
        subtitle={`${filtered.length} lançamentos`}
        noPadding
        actions={
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9A9A9A" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar..."
              className="pl-7 pr-3 py-1.5 rounded border text-xs focus:outline-none"
              style={{ backgroundColor: "#0F0F0F", borderColor: "#2A2422", color: "#F5F5F5", width: "160px" }}
            />
          </div>
        }
      >
        {filtered.length === 0 ? (
          <EmptyState icon={BookOpen} title="Sem movimentos" description="Nenhum lançamento encontrado para este dia." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Hora</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Descrição</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Referência</th>
                  <th className="text-center px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Tipo</th>
                  <th className="text-right px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Valor (AOA)</th>
                  <th className="text-right px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Saldo (AOA)</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>Responsável</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-[#1F1F1F] transition-colors"
                    style={{ backgroundColor: i % 2 === 0 ? "#1A1A1A" : "#141414" }}
                  >
                    <td className="px-4 py-3">
                      <span style={{ color: "#9A9A9A", fontSize: "12px", fontFamily: "monospace" }}>{entry.hora}</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{entry.descricao}</td>
                    <td className="px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 500 }}>{entry.referencia}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={entry.tipo} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        style={{
                          color: entry.tipo === "Entrada" ? "#10B981" : "#EF4444",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        {entry.tipo === "Entrada" ? "+" : "-"}{fmt(entry.valor)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" style={{ color: "#F5F5F5", fontSize: "13px", fontWeight: 600 }}>
                      {fmt(entry.saldo)}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px" }}>{entry.responsavel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* New Movement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "#00000080" }}>
          <div className="w-full max-w-md rounded-lg p-6 space-y-4" style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2422" }}>
            <h3 style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "18px" }}>Novo Movimento de Caixa</h3>

            <div className="grid grid-cols-2 gap-3">
              {(["Entrada", "Saída"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setNewEntry({ ...newEntry, tipo: t })}
                  className="py-3 rounded-md transition-colors"
                  style={{
                    backgroundColor: newEntry.tipo === t ? (t === "Entrada" ? "#10B98120" : "#EF444420") : "#0F0F0F",
                    border: `1px solid ${newEntry.tipo === t ? (t === "Entrada" ? "#10B981" : "#EF4444") : "#2A2422"}`,
                    color: newEntry.tipo === t ? (t === "Entrada" ? "#10B981" : "#EF4444") : "#9A9A9A",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {t === "Entrada" ? "↑ Entrada" : "↓ Saída"}
                </button>
              ))}
            </div>

            {[
              { label: "Descrição", key: "descricao", type: "text", placeholder: "Descrição do movimento" },
              { label: "Referência", key: "referencia", type: "text", placeholder: "Ex: FT 2025/XXX" },
              { label: "Valor (AOA)", key: "valor", type: "number", placeholder: "0" },
              { label: "Responsável", key: "responsavel", type: "text", placeholder: "Nome do responsável" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block mb-1" style={{ color: "#9A9A9A", fontSize: "12px" }}>{field.label}</label>
                <input
                  type={field.type}
                  value={(newEntry as Record<string, string>)[field.key]}
                  onChange={(e) => setNewEntry({ ...newEntry, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 rounded border focus:outline-none text-sm"
                  style={{ backgroundColor: "#0F0F0F", borderColor: "#2A2422", color: "#F5F5F5" }}
                />
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-md transition-colors"
                style={{ border: "1px solid #2A2422", color: "#9A9A9A", fontSize: "14px" }}
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#C9A84C", color: "#0F0F0F", fontWeight: 600, fontSize: "14px" }}
              >
                Registar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}