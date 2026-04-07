import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { SectionCard } from "../components/shared/SectionCard";
import { KPICard } from "../components/shared/KPICard";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Invoice {
  id: string;
  serie: string;
  cliente: string;
  nif: string;
  dataEmissao: string;
  dataVencimento: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: "Paga" | "Pendente" | "Vencida" | "Rascunho";
  moeda: "AOA" | "USD";
}

interface LineItem {
  id: string;
  descricao: string;
  quantidade: number;
  precoUnit: number;
  ivaPercent: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const invoices: Invoice[] = [
  { id: "FT 2025/245", serie: "FT", cliente: "Sonangol E.P.", nif: "5400012345", dataEmissao: "31/03/2025", dataVencimento: "30/04/2025", subtotal: 10964912, iva: 1535088, total: 12500000, estado: "Paga", moeda: "AOA" },
  { id: "FT 2025/244", serie: "FT", cliente: "Unitel S.A.", nif: "5400067890", dataEmissao: "30/03/2025", dataVencimento: "29/04/2025", subtotal: 7675439, iva: 1074561, total: 8750000, estado: "Pendente", moeda: "AOA" },
  { id: "FT 2025/243", serie: "FT", cliente: "BAI", nif: "5400098765", dataEmissao: "29/03/2025", dataVencimento: "28/04/2025", subtotal: 13333333, iva: 1866667, total: 15200000, estado: "Paga", moeda: "AOA" },
  { id: "FT 2025/242", serie: "FT", cliente: "Angola Telecom", nif: "5400011111", dataEmissao: "28/03/2025", dataVencimento: "27/04/2025", subtotal: 5526316, iva: 773684, total: 6300000, estado: "Vencida", moeda: "AOA" },
  { id: "FT 2025/241", serie: "FT", cliente: "TAAG", nif: "5400022222", dataEmissao: "27/03/2025", dataVencimento: "26/04/2025", subtotal: 8596491, iva: 1203509, total: 9800000, estado: "Paga", moeda: "AOA" },
  { id: "FT 2025/240", serie: "FT", cliente: "BFA", nif: "5400033333", dataEmissao: "25/03/2025", dataVencimento: "24/04/2025", subtotal: 6140351, iva: 859649, total: 7000000, estado: "Pendente", moeda: "AOA" },
  { id: "FT 2025/239", serie: "FT", cliente: "Endiama", nif: "5400044444", dataEmissao: "22/03/2025", dataVencimento: "21/04/2025", subtotal: 17543860, iva: 2456140, total: 20000000, estado: "Paga", moeda: "AOA" },
  { id: "FT 2025/238", serie: "FT", cliente: "BIC", nif: "5400055555", dataEmissao: "20/03/2025", dataVencimento: "19/04/2025", subtotal: 4385965, iva: 614035, total: 5000000, estado: "Rascunho", moeda: "AOA" },
];

const clients = ["Sonangol E.P.", "Unitel S.A.", "BAI", "Angola Telecom", "TAAG", "BFA", "Endiama", "BIC", "Multichoice Angola", "ENSA"];

const fmt = (v: number, dec = 0) =>
  new Intl.NumberFormat("pt-AO", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v);

const BNA_RATE = 850;

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  Paga:     { bg: "rgba(16,185,129,0.09)",   text: "#10B981", border: "rgba(16,185,129,0.3)" },
  Pendente: { bg: "rgba(245,158,11,0.09)",   text: "#F59E0B", border: "rgba(245,158,11,0.3)" },
  Vencida:  { bg: "rgba(239,68,68,0.09)",    text: "#EF4444", border: "rgba(239,68,68,0.3)" },
  Rascunho: { bg: "rgba(107,114,128,0.09)",  text: "#6B7280", border: "rgba(107,114,128,0.3)" },
};

// ─── Create Invoice Modal ─────────────────────────────────────────────────────

function CreateInvoiceModal({ onClose }: { onClose: () => void }) {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", descricao: "", quantidade: 1, precoUnit: 0, ivaPercent: 14 },
  ]);
  const [cliente, setCliente] = useState("");
  const [nif, setNif] = useState("");
  const [dataEmissao] = useState("2025-03-31");
  const [dataVencimento, setDataVencimento] = useState("2025-04-30");

  const addItem = () =>
    setLineItems([...lineItems, { id: Date.now().toString(), descricao: "", quantidade: 1, precoUnit: 0, ivaPercent: 14 }]);

  const removeItem = (id: string) => {
    if (lineItems.length > 1) setLineItems(lineItems.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) =>
    setLineItems(lineItems.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const subtotal = lineItems.reduce((s, i) => s + i.quantidade * i.precoUnit, 0);
  const totalIVA = lineItems.reduce((s, i) => s + (i.quantidade * i.precoUnit * i.ivaPercent) / 100, 0);
  const total = subtotal + totalIVA;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6 overflow-y-auto" style={{ backgroundColor: "#00000085" }}>
      <div className="w-full max-w-3xl rounded-lg" style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2422" }}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#2A2422" }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md" style={{ backgroundColor: "var(--icon-bg)" }}>
              <FileText size={16} style={{ color: "var(--primary)" }} />
            </div>
            <div>
              <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "16px" }}>Nova Fatura</p>
              <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Série: FT 2025/246 · AGT-Compliant</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-[#2A2422] transition-colors">
            <X size={18} style={{ color: "#9A9A9A" }} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Client & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5" style={{ color: "#9A9A9A", fontSize: "12px", fontWeight: 500 }}>
                Cliente *
              </label>
              <select
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="w-full px-3 py-2.5 rounded border focus:outline-none text-sm"
                style={{ backgroundColor: "#0F0F0F", borderColor: "#2A2422", color: "#F5F5F5" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              >
                <option value="">Selecionar cliente…</option>
                {clients.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1.5" style={{ color: "#9A9A9A", fontSize: "12px", fontWeight: 500 }}>
                NIF do Cliente
              </label>
              <input
                value={nif}
                onChange={(e) => setNif(e.target.value)}
                placeholder="Ex: 5400000000"
                className="w-full px-3 py-2.5 rounded border focus:outline-none text-sm"
                style={{ backgroundColor: "#0F0F0F", borderColor: "#2A2422", color: "#F5F5F5" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div>
              <label className="block mb-1.5" style={{ color: "#9A9A9A", fontSize: "12px", fontWeight: 500 }}>
                Série da Fatura
              </label>
              <input
                readOnly
                defaultValue="FT 2025/246"
                className="w-full px-3 py-2.5 rounded border text-sm"
                style={{ backgroundColor: "#141414", borderColor: "#2A2422", color: "#9A9A9A", cursor: "not-allowed" }}
              />
            </div>
            <div>
              <label className="block mb-1.5" style={{ color: "#9A9A9A", fontSize: "12px", fontWeight: 500 }}>
                Data de Vencimento
              </label>
              <input
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                className="w-full px-3 py-2.5 rounded border focus:outline-none text-sm"
                style={{ backgroundColor: "#0F0F0F", borderColor: "#2A2422", color: "#F5F5F5" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "14px" }}>Itens da Fatura</p>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs"
                style={{ border: "1px solid var(--primary)", color: "var(--primary)", fontWeight: 600 }}
              >
                <Plus size={13} /> Adicionar Item
              </button>
            </div>
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0F0F0F" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(37,99,235,0.4)" }}>
                    {["Descrição", "Qtd", "Preço Unit. (AOA)", "IVA %", "Total", ""].map((h) => (
                      <th key={h} className="text-left px-3 py-2.5" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, idx) => {
                    const itemTotal = item.quantidade * item.precoUnit * (1 + item.ivaPercent / 100);
                    return (
                      <tr key={item.id} style={{ backgroundColor: idx % 2 === 0 ? "#0F0F0F" : "#141414" }}>
                        <td className="px-3 py-2">
                          <input
                            value={item.descricao}
                            onChange={(e) => updateItem(item.id, "descricao", e.target.value)}
                            placeholder="Descrição do serviço/produto"
                            className="w-full px-2.5 py-1.5 rounded border focus:outline-none text-xs"
                            style={{ backgroundColor: "#1A1A1A", borderColor: "#2A2422", color: "#F5F5F5", minWidth: "160px" }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={item.quantidade}
                            onChange={(e) => updateItem(item.id, "quantidade", parseInt(e.target.value) || 0)}
                            min="1"
                            className="w-16 px-2 py-1.5 rounded border focus:outline-none text-xs text-center"
                            style={{ backgroundColor: "#1A1A1A", borderColor: "#2A2422", color: "#F5F5F5" }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={item.precoUnit}
                            onChange={(e) => updateItem(item.id, "precoUnit", parseFloat(e.target.value) || 0)}
                            min="0"
                            className="w-28 px-2 py-1.5 rounded border focus:outline-none text-xs text-right"
                            style={{ backgroundColor: "#1A1A1A", borderColor: "#2A2422", color: "#F5F5F5" }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={item.ivaPercent}
                            onChange={(e) => updateItem(item.id, "ivaPercent", parseInt(e.target.value))}
                            className="w-16 px-2 py-1.5 rounded border focus:outline-none text-xs"
                            style={{ backgroundColor: "#1A1A1A", borderColor: "#2A2422", color: "#F5F5F5" }}
                          >
                            <option value="0">0%</option>
                            <option value="14">14%</option>
                          </select>
                        </td>
                        <td className="px-3 py-2" style={{ color: "#F5F5F5", fontSize: "12px", fontWeight: 600 }}>
                          {fmt(itemTotal, 2)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={lineItems.length === 1}
                            className="p-1 rounded hover:bg-[#2A2422] transition-colors"
                            style={{ color: lineItems.length === 1 ? "#2A2422" : "#EF4444" }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between pb-2 border-b" style={{ borderColor: "#2A2422" }}>
                <span style={{ color: "#9A9A9A", fontSize: "13px" }}>Subtotal</span>
                <span style={{ color: "#F5F5F5", fontSize: "13px", fontWeight: 500 }}>{fmt(subtotal, 2)} AOA</span>
              </div>
              <div className="flex justify-between pb-2 border-b" style={{ borderColor: "#2A2422" }}>
                <span style={{ color: "#9A9A9A", fontSize: "13px" }}>IVA (14%)</span>
                <span style={{ color: "#F5F5F5", fontSize: "13px", fontWeight: 500 }}>{fmt(totalIVA, 2)} AOA</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span style={{ color: "var(--primary)", fontSize: "16px", fontWeight: 700 }}>Total</span>
                <div className="text-right">
                  <p style={{ color: "var(--primary)", fontSize: "20px", fontWeight: 700 }}>{fmt(total, 2)} AOA</p>
                  <p style={{ color: "#9A9A9A", fontSize: "11px" }}>≈ {fmt(total / BNA_RATE, 2)} USD</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ backgroundColor: "#3B82F615", border: "1px solid #3B82F640" }}
          >
            <FileText size={14} style={{ color: "#3B82F6", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ color: "#9A9A9A", fontSize: "12px" }}>
              Série <strong style={{ color: "#F5F5F5" }}>FT 2025/246</strong> · IVA 14% · Conforme{" "}
              <strong style={{ color: "#F5F5F5" }}>regulamentação AGT</strong>
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t flex gap-3 justify-end" style={{ borderColor: "#2A2422" }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm transition-colors hover:bg-[#2A2422]"
            style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#2A2422", color: "#9A9A9A", border: "1px solid #2A2422" }}
          >
            Guardar Rascunho
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--primary)", color: "#0F0F0F", fontWeight: 700 }}
          >
            <FileText size={14} />
            Emitir Fatura
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Detail Modal ─────────────────────────────────────────────────────

function InvoiceDetailModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const s = statusConfig[invoice.estado];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "#00000085" }}>
      <div className="w-full max-w-lg rounded-lg" style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2422" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#2A2422" }}>
          <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "16px" }}>{invoice.id}</p>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[#2A2422] transition-colors">
            <X size={16} style={{ color: "#9A9A9A" }} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Cliente", value: invoice.cliente },
              { label: "NIF", value: invoice.nif },
              { label: "Data de Emissão", value: invoice.dataEmissao },
              { label: "Data de Vencimento", value: invoice.dataVencimento },
              { label: "Moeda", value: invoice.moeda },
              { label: "Estado", value: invoice.estado },
            ].map((f) => (
              <div key={f.label}>
                <p style={{ color: "#9A9A9A", fontSize: "11px", marginBottom: "2px" }}>{f.label}</p>
                {f.label === "Estado" ? (
                  <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: s.bg, color: s.text, fontWeight: 600 }}>
                    {f.value}
                  </span>
                ) : (
                  <p style={{ color: "#F5F5F5", fontSize: "13px", fontWeight: 500 }}>{f.value}</p>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: "#0F0F0F" }}>
            <div className="flex justify-between">
              <span style={{ color: "#9A9A9A", fontSize: "13px" }}>Subtotal</span>
              <span style={{ color: "#F5F5F5", fontSize: "13px" }}>{fmt(invoice.subtotal, 2)} AOA</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#9A9A9A", fontSize: "13px" }}>IVA (14%)</span>
              <span style={{ color: "#F5F5F5", fontSize: "13px" }}>{fmt(invoice.iva, 2)} AOA</span>
            </div>
            <div className="flex justify-between pt-2 border-t" style={{ borderColor: "#2A2422" }}>
              <span style={{ color: "var(--primary)", fontWeight: 700 }}>Total</span>
              <div className="text-right">
                <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "16px" }}>{fmt(invoice.total, 2)} AOA</span>
                <p style={{ color: "#9A9A9A", fontSize: "11px" }}>≈ {fmt(invoice.total / BNA_RATE, 2)} USD</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", color: "#0F0F0F", fontWeight: 600 }}>
              <Download size={14} /> Download PDF
            </button>
            <button onClick={onClose} className="px-4 py-2.5 rounded-md text-sm transition-colors hover:bg-[#2A2422]"
              style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Faturacao() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [sortField, setSortField] = useState<"dataEmissao" | "total">("dataEmissao");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalPago = invoices.filter((i) => i.estado === "Paga").reduce((s, i) => s + i.total, 0);
  const totalPendente = invoices.filter((i) => i.estado === "Pendente").reduce((s, i) => s + i.total, 0);
  const totalVencido = invoices.filter((i) => i.estado === "Vencida").reduce((s, i) => s + i.total, 0);
  const totalEmitido = invoices.reduce((s, i) => s + i.total, 0);

  const statuses = ["Todos", "Paga", "Pendente", "Vencida", "Rascunho"];

  const filtered = invoices
    .filter((inv) => {
      const matchSearch =
        inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.cliente.toLowerCase().includes(search.toLowerCase()) ||
        inv.nif.includes(search);
      const matchStatus = filterStatus === "Todos" || inv.estado === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === "total")
        return sortDir === "asc" ? a.total - b.total : b.total - a.total;
      return sortDir === "asc"
        ? a.dataEmissao.localeCompare(b.dataEmissao)
        : b.dataEmissao.localeCompare(a.dataEmissao);
    });

  const toggleSort = (f: "dataEmissao" | "total") => {
    if (sortField === f) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("desc"); }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        icon={FileText}
        title="Faturação"
        subtitle="Gestão de faturas AGT-compliant · Série FT 2025"
        actions={
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs transition-colors"
              style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}
            >
              <Download size={13} /> Exportar
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", color: "#0F0F0F", fontWeight: 600, fontSize: "13px" }}
            >
              <Plus size={15} /> Nova Fatura
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Emitido (Mar)" value={`${(totalEmitido / 1000000).toFixed(1)}M AOA`} icon={FileText} change="+8.2%" trend="up" />
        <KPICard title="Cobrado" value={`${(totalPago / 1000000).toFixed(1)}M AOA`} icon={CheckCircle} change={`${invoices.filter(i => i.estado === "Paga").length} faturas`} trend="up" accent />
        <KPICard title="Por Cobrar" value={`${(totalPendente / 1000000).toFixed(1)}M AOA`} icon={Clock} change={`${invoices.filter(i => i.estado === "Pendente").length} faturas`} trend="neutral" />
        <KPICard title="Vencido" value={`${(totalVencido / 1000000).toFixed(1)}M AOA`} icon={AlertTriangle} change={`${invoices.filter(i => i.estado === "Vencida").length} fatura(s)`} trend="down" />
      </div>

      {/* Table */}
      <SectionCard title="" noPadding>
        {/* Filters Bar */}
        <div
          className="flex flex-wrap items-center gap-2 px-4 py-3 border-b"
          style={{ borderColor: "#2A2422" }}
        >
          {/* Status Tabs */}
          <div className="flex gap-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="px-3 py-1.5 rounded-md text-xs transition-colors"
                style={{
                  backgroundColor: filterStatus === s ? "#2A2422" : "transparent",
                  color: filterStatus === s ? "var(--primary)" : "var(--text-secondary)",
                  fontWeight: filterStatus === s ? 600 : 500,
                  border: filterStatus === s ? "1px solid rgba(37,99,235,0.35)" : "1px solid transparent",
                }}
              >
                {s}
                {s !== "Todos" && (
                  <span className="ml-1.5 px-1 rounded" style={{ backgroundColor: statusConfig[s]?.bg || "#2A2422", color: statusConfig[s]?.text || "#9A9A9A", fontSize: "10px" }}>
                    {invoices.filter((i) => i.estado === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9A9A9A" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar fatura ou cliente…"
                className="pl-8 pr-3 py-1.5 rounded border text-xs focus:outline-none"
                style={{ backgroundColor: "#0F0F0F", borderColor: "#2A2422", color: "#F5F5F5", width: "200px" }}
              />
            </div>
            <button className="p-1.5 rounded" style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}>
              <Filter size={13} />
            </button>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState icon={FileText} title="Sem faturas" description="Não foram encontradas faturas com os filtros actuais." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--primary)" }}>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Série</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Cliente</th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>NIF</th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}
                    onClick={() => toggleSort("dataEmissao")}
                  >
                    Emissão {sortField === "dataEmissao" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th className="text-left px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Vencimento</th>
                  <th
                    className="text-right px-4 py-3 cursor-pointer"
                    style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}
                    onClick={() => toggleSort("total")}
                  >
                    Total (AOA) {sortField === "total" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                  <th className="text-center px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Estado</th>
                  <th className="text-center px-4 py-3" style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 600 }}>Acções</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, i) => {
                  const s = statusConfig[inv.estado];
                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                      style={{ backgroundColor: i % 2 === 0 ? "#1A1A1A" : "#141414" }}
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <td className="px-4 py-3" style={{ color: "var(--primary)", fontSize: "12px", fontWeight: 600 }}>{inv.id}</td>
                      <td className="px-4 py-3" style={{ color: "#F5F5F5", fontSize: "13px" }}>{inv.cliente}</td>
                      <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px", fontFamily: "monospace" }}>{inv.nif}</td>
                      <td className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px" }}>{inv.dataEmissao}</td>
                      <td className="px-4 py-3">
                        <span
                          style={{
                            color: inv.estado === "Vencida" ? "#EF4444" : "#9A9A9A",
                            fontSize: "12px",
                            fontWeight: inv.estado === "Vencida" ? 600 : 400,
                          }}
                        >
                          {inv.dataVencimento}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          <span style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "13px" }}>
                            {fmt(inv.total, 2)}
                          </span>
                          <p style={{ color: "#9A9A9A", fontSize: "10px" }}>
                            ≈ {fmt(inv.total / BNA_RATE, 0)} USD
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs"
                          style={{ backgroundColor: s.bg, color: s.text, fontWeight: 600, border: `1px solid ${s.border}` }}
                        >
                          {inv.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 rounded hover:bg-[#2A2422] transition-colors"
                            style={{ color: "#9A9A9A" }}
                            title="Ver detalhe"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            className="p-1.5 rounded hover:bg-[#2A2422] transition-colors"
                            style={{ color: "#9A9A9A" }}
                            title="Download PDF"
                          >
                            <Download size={13} />
                          </button>
                          {inv.estado === "Rascunho" && (
                            <button
                              className="p-1.5 rounded hover:bg-[#EF444415] transition-colors"
                              style={{ color: "#EF4444" }}
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid #2A2422" }}>
                  <td colSpan={5} className="px-4 py-3" style={{ color: "#9A9A9A", fontSize: "12px" }}>
                    {filtered.length} registo{filtered.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 text-right" style={{ color: "var(--primary)", fontWeight: 700, fontSize: "13px" }}>
                    {fmt(filtered.reduce((s, i) => s + i.total, 0), 2)} AOA
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Info Banner */}
      <div
        className="flex items-start gap-3 p-4 rounded-lg"
        style={{ backgroundColor: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.2)" }}
      >
        <ArrowUpRight size={15} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "1px" }} />
        <p style={{ color: "var(--text-secondary)", fontSize: "12px", lineHeight: 1.6 }}>
          As faturas são emitidas em conformidade com a <strong style={{ color: "var(--text-primary)" }}>regulamentação AGT</strong>.
          IVA aplicável: <strong style={{ color: "var(--primary)" }}>14%</strong> · Regime Geral.
          Próxima série: <strong style={{ color: "var(--text-primary)" }}>FT 2025/246</strong>.
          Declaração IVA de Março vence em <strong style={{ color: "var(--text-primary)" }}>15/04/2025</strong>.
        </p>
      </div>

      {/* Modals */}
      {showCreate && <CreateInvoiceModal onClose={() => setShowCreate(false)} />}
      {selectedInvoice && <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
    </div>
  );
}