import { useState } from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Plus,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Box,
  Clock,
  DollarSign,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stockItems = [
  {
    id: "PRD-001",
    name: "Computador Portátil Dell Latitude 5420",
    category: "Equipamento IT",
    quantity: 45,
    minStock: 20,
    unit: "un",
    costPrice: 850000,
    salePrice: 1200000,
    supplier: "Tech Solutions Angola",
    lastMovement: "28/03/2025",
    location: "Armazém A - Setor 2",
  },
  {
    id: "PRD-002",
    name: "Mesa de Escritório Executiva",
    category: "Mobiliário",
    quantity: 12,
    minStock: 15,
    unit: "un",
    costPrice: 125000,
    salePrice: 180000,
    supplier: "Moveis Luanda Lda",
    lastMovement: "30/03/2025",
    location: "Armazém B - Setor 1",
  },
  {
    id: "PRD-003",
    name: "Toner HP LaserJet P1102w",
    category: "Consumíveis",
    quantity: 8,
    minStock: 25,
    unit: "un",
    costPrice: 15000,
    salePrice: 22500,
    supplier: "Office Supplies Angola",
    lastMovement: "31/03/2025",
    location: "Armazém A - Setor 5",
  },
  {
    id: "PRD-004",
    name: "Cadeira Ergonómica Premium",
    category: "Mobiliário",
    quantity: 67,
    minStock: 30,
    unit: "un",
    costPrice: 85000,
    salePrice: 125000,
    supplier: "Moveis Luanda Lda",
    lastMovement: "29/03/2025",
    location: "Armazém B - Setor 1",
  },
  {
    id: "PRD-005",
    name: "Resma Papel A4 - 500 folhas",
    category: "Consumíveis",
    quantity: 235,
    minStock: 100,
    unit: "resma",
    costPrice: 4500,
    salePrice: 6500,
    supplier: "Office Supplies Angola",
    lastMovement: "31/03/2025",
    location: "Armazém A - Setor 5",
  },
  {
    id: "PRD-006",
    name: "Monitor LED 24\" Dell P2422H",
    category: "Equipamento IT",
    quantity: 5,
    minStock: 15,
    unit: "un",
    costPrice: 195000,
    salePrice: 280000,
    supplier: "Tech Solutions Angola",
    lastMovement: "27/03/2025",
    location: "Armazém A - Setor 2",
  },
];

const recentMovements = [
  {
    id: "MOV-0234",
    type: "entrada",
    product: "Computador Portátil Dell Latitude 5420",
    quantity: 15,
    date: "31/03/2025",
    reference: "Compra PO-2025/045",
    user: "João Silva",
  },
  {
    id: "MOV-0233",
    type: "saida",
    product: "Cadeira Ergonómica Premium",
    quantity: 8,
    date: "31/03/2025",
    reference: "Venda FT 2025/245",
    user: "Maria Costa",
  },
  {
    id: "MOV-0232",
    type: "entrada",
    product: "Resma Papel A4 - 500 folhas",
    quantity: 50,
    date: "30/03/2025",
    reference: "Compra PO-2025/044",
    user: "João Silva",
  },
  {
    id: "MOV-0231",
    type: "saida",
    product: "Monitor LED 24\" Dell P2422H",
    quantity: 3,
    date: "30/03/2025",
    reference: "Venda FT 2025/243",
    user: "Maria Costa",
  },
  {
    id: "MOV-0230",
    type: "ajuste",
    product: "Toner HP LaserJet P1102w",
    quantity: -2,
    date: "29/03/2025",
    reference: "Ajuste de Inventário",
    user: "Admin",
  },
];

const stockSummary = {
  totalProducts: 156,
  lowStockItems: 3,
  totalValue: 48750000,
  monthlyMovements: 127,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Equipamento IT", "Mobiliário", "Consumíveis"];

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = stockItems.filter((item) => item.quantity < item.minStock);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Gestão de Estoque
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Controlo de inventário e movimentações de stock
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)] transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Produto
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--color-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Total de Produtos
              </p>
              <p className="text-2xl font-semibold text-[var(--color-text-primary)] mt-2">
                {stockSummary.totalProducts}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                12% vs mês anterior
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Stock Baixo
              </p>
              <p className="text-2xl font-semibold text-[var(--color-text-primary)] mt-2">
                {stockSummary.lowStockItems}
              </p>
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Requer atenção
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Valor Total em Stock
              </p>
              <p className="text-2xl font-semibold text-[var(--color-text-primary)] mt-2">
                {formatCurrency(stockSummary.totalValue)}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                ≈ ${(stockSummary.totalValue / 900).toFixed(2)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Movimentos (Mês)
              </p>
              <p className="text-2xl font-semibold text-[var(--color-text-primary)] mt-2">
                {stockSummary.monthlyMovements}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                8% vs mês anterior
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 dark:text-red-200">
                Alerta de Stock Baixo
              </h3>
              <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                {lowStockItems.length} produto(s) com stock abaixo do mínimo:{" "}
                {lowStockItems.map((item) => item.name).join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou código do produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="all">Todas Categorias</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-card-hover)] transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Stock Atual
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Preço Custo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Preço Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredItems.map((item) => {
                const isLowStock = item.quantity < item.minStock;
                const stockPercentage = (item.quantity / item.minStock) * 100;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--color-card-hover)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
                          <Box className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-text-primary)]">
                            {item.name}
                          </p>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {item.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {item.quantity} {item.unit}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {item.minStock} {item.unit}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {formatCurrency(item.costPrice)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {formatCurrency(item.salePrice)}
                      </p>
                      <p className="text-xs text-green-600">
                        +
                        {(
                          ((item.salePrice - item.costPrice) / item.costPrice) *
                          100
                        ).toFixed(0)}
                        % margem
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {item.location}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                          <AlertTriangle className="w-3 h-3" />
                          Baixo
                        </span>
                      ) : stockPercentage < 150 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50">
                          Normal
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                          Bom
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Movimentos Recentes
          </h2>
          <button className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium">
            Ver Todos
          </button>
        </div>
        <div className="space-y-4">
          {recentMovements.map((movement) => (
            <div
              key={movement.id}
              className="flex items-center gap-4 pb-4 border-b border-[var(--color-border)] last:border-0 last:pb-0"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  movement.type === "entrada"
                    ? "bg-green-100 dark:bg-green-950/30"
                    : movement.type === "saida"
                    ? "bg-red-100 dark:bg-red-950/30"
                    : "bg-blue-100 dark:bg-blue-950/30"
                }`}
              >
                {movement.type === "entrada" ? (
                  <ArrowDownRight
                    className={`w-5 h-5 ${
                      movement.type === "entrada"
                        ? "text-green-600"
                        : movement.type === "saida"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  />
                ) : movement.type === "saida" ? (
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                ) : (
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[var(--color-text-primary)] truncate">
                    {movement.product}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      movement.type === "entrada"
                        ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                        : movement.type === "saida"
                        ? "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                        : "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                    }`}
                  >
                    {movement.type === "entrada"
                      ? "Entrada"
                      : movement.type === "saida"
                      ? "Saída"
                      : "Ajuste"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-[var(--color-text-secondary)]">
                  <span>{movement.reference}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {movement.date}
                  </span>
                  <span>•</span>
                  <span>{movement.user}</span>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    movement.type === "entrada"
                      ? "text-green-600"
                      : movement.type === "saida"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {movement.type === "entrada" ? "+" : movement.type === "saida" ? "-" : ""}
                  {Math.abs(movement.quantity)} un
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {movement.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
