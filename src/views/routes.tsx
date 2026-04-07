import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Faturacao from "./pages/Faturacao";
import RecursosHumanos from "./pages/RecursosHumanos";
import Tesouraria from "./pages/Tesouraria";
import Financeiro from "./pages/Financeiro";
import DiarioCaixa from "./pages/DiarioCaixa";
import Fiscalidade from "./pages/Fiscalidade";
import ContaBancaria from "./pages/ContaBancaria";
import Plafond from "./pages/Plafond";
import Configuracoes from "./pages/Configuracoes";
import MobileDashboard from "./pages/MobileDashboard";
import StyleGuide from "./pages/StyleGuide";
import Estoque from "./pages/Estoque";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "financeiro", Component: Financeiro },
      { path: "diario-caixa", Component: DiarioCaixa },
      { path: "faturacao", Component: Faturacao },
      { path: "rh", Component: RecursosHumanos },
      { path: "fiscalidade", Component: Fiscalidade },
      { path: "conta-bancaria", Component: ContaBancaria },
      { path: "plafond", Component: Plafond },
      { path: "tesouraria", Component: Tesouraria },
      { path: "estoque", Component: Estoque },
      { path: "configuracoes", Component: Configuracoes },
    ],
  },
  {
    path: "/mobile",
    Component: MobileDashboard,
  },
  {
    path: "/style-guide",
    Component: StyleGuide,
  },
]);