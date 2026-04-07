import { useState } from "react";
import { Building2, Plus, Search, ArrowUpRight, ArrowDownRight, RefreshCw, Eye, EyeOff } from "lucide-react";
import { PageHeader } from "../components/shared/PageHeader";
import { SectionCard } from "../components/shared/SectionCard";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";

const fmt = (v: number, decimals = 0) =>
  new Intl.NumberFormat("pt-AO", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);

const BNA_RATE = 850;

interface BankAccount {
  id: string;
  banco: string;
  iban: string;
  moeda: "AOA" | "USD" | "EUR";
  saldo: number;
  tipo: string;
  cor: string;
}

interface Transaction {
  id: string;
  contaId: string;
  data: string;
  descricao: string;
  tipo: "credito" | "debito";
  valor: number;
  saldoApos: number;
  referencia?: string;
}

const bankAccounts: BankAccount[] = [
  { id: "BAI-1", banco: "BAI", iban: "AO06 0040 0000 1234 5678 9012 3", moeda: "AOA", saldo: 45800000, tipo: "Conta Corrente", cor: "var(--primary)" },
  { id: "BFA-1", banco: "BFA", iban: "AO06 1234 5678 9012 3456 7890 1", moeda: "AOA", saldo: 32500000, tipo: "Conta Corrente", cor: "#3B82F6" },
  { id: "BIC-1", banco: "BIC", iban: "AO06 0001 0002 0003 0004 0005 6", moeda: "AOA", saldo: 28900000, tipo: "Conta Poupança", cor: "#10B981" },
  { id: "BAI-2", banco: "BAI", iban: "AO06 0040 0000 5432 1876 0912 7", moeda: "USD", saldo: 125000, tipo: "Conta em Divisas", cor: "var(--primary)" },
  { id: "BFA-2", banco: "BFA", iban: "AO06 1234 5678 9012 0011 2233 4", moeda: "EUR", saldo: 48000, tipo: "Conta em Divisas", cor: "#3B82F6" },
];

const transactions: Transaction[] = [
  { id: "TXN-001", contaId: "BAI-1", data: "31/03/2025", descricao: "Recebimento FT 2025/245 — Sonangol", tipo: "credito", valor: 12500000, saldoApos: 45800000, referencia: "FT 2025/245" },
  { id: "TXN-002", contaId: "BAI-1", data: "30/03/2025", descricao: "Pagamento Aluguel Março", tipo: "debito", valor: 2500000, saldoApos: 33300000, referencia: "ALG-MAR" },
  { id: "TXN-003", contaId: "BAI-1", data: "29/03/2025", descricao: "Recebimento FT 2025/243 — BAI", tipo: "credito", valor: 15200000, saldoApos: 35800000, referencia: "FT 2025/243" },
  { id: "TXN-004", contaId: "BFA-1", data: "31/03/2025", descricao: "Pagamento Fornecedor Electro Services", tipo: "debito", valor: 8500000, saldoApos: 32500000, referencia: "DES-2025/0040" },
  { id: "TXN-005", contaId: "BFA-1", data: "28/03/2025", descricao: "Recebimento FT 2025/241 — TAAG", tipo: "credito", valor: 9800000, saldoApos: 41000000, referencia: "FT 2025/241" },
  { id: "TXN-006", contaId: "BIC-1", data: "31/03/2025", descricao: "Transferência interna — BIC", tipo: "credito", valor: 5000000, saldoApos: 28900000 },
  { id: "TXN-007", contaId: "BAI-2", data: "30/03/2025", descricao: "Recebimento serviços — Contrato USD", tipo: "credito", valor: 15000, saldoApos: 125000 },
];

export default function ContaBancaria() {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount>(bankAccounts[0]);
  const [search, setSearch] = useState("");
  const [hideBalances, setHideBalances] = useState(false);

  const totalAOA = bankAccounts.filter((a) => a.moeda === "AOA").reduce((s, a) => s + a.saldo, 0);
  const totalUSD = bankAccounts.filter((a) => a.moeda === "USD").reduce((s, a) => s + a.saldo, 0);
  const totalEUR = bankAccounts.filter((a) => a.moeda === "EUR").reduce((s, a) => s + a.saldo, 0);
  const totalEquivAOA = totalAOA + totalUSD * BNA_RATE + totalEUR * BNA_RATE * 0.93;

  const accountTransactions = transactions.filter(
    (t) =>
      t.contaId === selectedAccount.id &&
      (t.descricao.toLowerCase().includes(search.toLowerCase()) ||
        (t.referencia || "").toLowerCase().includes(search.toLowerCase()))
  );

  const moedaSymbol: Record<string, string> = { AOA: "AOA", USD: "$", EUR: "€" };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        icon={Building2}
        title="Conta Bancária"
        subtitle="Gestão de contas e movimentos bancários"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="p-2 rounded-md transition-colors"
              style={{ border: "1px solid #2A2422", color: "#9A9A9A" }}
            >
              {hideBalances ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--primary)", color: "#fff", fontWeight: 600, fontSize: "13px" }}
            >
              <Plus size={15} /> Nova Conta
            </button>
          </div>
        }
      />

      {/* Total Consolidado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 p-5 rounded-lg" style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(37,99,235,0.25)" }}>
          <p style={{ color: "#9A9A9A", fontSize: "12px" }}>Saldo Total Consolidado (equiv.)</p>
          <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "28px", marginTop: "4px" }}>
            {hideBalances ? "•••••••" : fmt(Math.round(totalEquivAOA))} <span style={{ fontSize: "14px", color: "#9A9A9A" }}>AOA</span>
          </p>
          <p style={{ color: "#9A9A9A", fontSize: "11px", marginTop: "4px" }}>
            Taxa BNA: 1 USD = {BNA_RATE} AOA · Actualizado em 31/03/2025
          </p>
        </div>
        {[
          { label: "Total AOA", value: fmt(totalAOA), tag: "AOA" },
          { label: "Total USD", value: fmt(totalUSD, 0), tag: "USD" },
        ].map((item) => (
          <div key={item.tag} className="p-5 rounded-lg" style={{ backgroundColor: "#1A1A1A" }}>
            <p style={{ color: "#9A9A9A", fontSize: "12px" }}>{item.label}</p>
            <p style={{ color: "#F5F5F5", fontWeight: 700, fontSize: "20px", marginTop: "4px" }}>
              {hideBalances ? "•••••" : item.value}
            </p>
            <p style={{ color: "#9A9A9A", fontSize: "11px" }}>{item.tag}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account List */}
        <div className="space-y-3">
          <h3 style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "14px" }}>Contas ({bankAccounts.length})</h3>
          {bankAccounts.map((account) => (
            <button
              key={account.id}
              onClick={() => setSelectedAccount(account)}
              className="w-full text-left p-4 rounded-lg transition-colors"
              style={{
                backgroundColor: selectedAccount.id === account.id ? "#2A2422" : "#1A1A1A",
                border: `1px solid ${selectedAccount.id === account.id ? account.cor : "#2A2422"}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${account.cor}20`, color: account.cor, fontWeight: 700, fontSize: "11px" }}
                  >
                    {account.banco}
                  </div>
                  <div>
                    <p style={{ color: "#F5F5F5", fontWeight: 600, fontSize: "13px" }}>{account.banco}</p>
                    <p style={{ color: "#9A9A9A", fontSize: "11px" }}>{account.tipo}</p>
                  </div>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ backgroundColor: `${account.cor}20`, color: account.cor, fontWeight: 600 }}
                >
                  {account.moeda}
                </span>
              </div>
              <p style={{ color: "#9A9A9A", fontSize: "10px", fontFamily: "monospace", marginBottom: "4px" }}>
                {account.iban}
              </p>
              <p style={{ color: account.cor, fontWeight: 700, fontSize: "16px" }}>
                {hideBalances ? "•••••••" : `${moedaSymbol[account.moeda]} ${fmt(account.saldo)}`}
              </p>
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2">
          <SectionCard
            title={`Movimentos — ${selectedAccount.banco} (${selectedAccount.moeda})`}
            subtitle={`${accountTransactions.length} transações`}
            noPadding
            actions={
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#9A9A9A" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar..."
                  className="pl-7 pr-3 py-1.5 rounded border text-xs focus:outline-none"
                  style={{ backgroundColor: "#0F0F0F", borderColor: "#2A2422", color: "#F5F5F5", width: "150px" }}
                />
              </div>
            }
          >
            {accountTransactions.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="Sem movimentos"
                description="Nenhuma transação encontrada para esta conta."
              />
            ) : (
              <div className="divide-y" style={{ borderColor: "#2A2422" }}>
                {accountTransactions.map((txn) => (
                  <div key={txn.id} className="px-5 py-3 hover:bg-[#1F1F1F] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: txn.tipo === "credito" ? "#10B98115" : "#EF444415" }}
                        >
                          {txn.tipo === "credito" ? (
                            <ArrowDownRight size={16} style={{ color: "#10B981" }} />
                          ) : (
                            <ArrowUpRight size={16} style={{ color: "#EF4444" }} />
                          )}
                        </div>
                        <div>
                          <p style={{ color: "#F5F5F5", fontSize: "13px", fontWeight: 500 }}>{txn.descricao}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span style={{ color: "#9A9A9A", fontSize: "11px" }}>{txn.data}</span>
                            {txn.referencia && (
                              <>
                                <span style={{ color: "#2A2422" }}>·</span>
                                <span style={{ color: "var(--primary)", fontSize: "11px", fontWeight: 500 }}>{txn.referencia}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p
                          style={{
                            color: txn.tipo === "credito" ? "#10B981" : "#EF4444",
                            fontWeight: 700,
                            fontSize: "14px",
                          }}
                        >
                          {txn.tipo === "credito" ? "+" : "-"}{moedaSymbol[selectedAccount.moeda]} {fmt(txn.valor)}
                        </p>
                        <p style={{ color: "#9A9A9A", fontSize: "11px" }}>
                          Saldo: {hideBalances ? "•••••" : fmt(txn.saldoApos)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}