import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHome } from "./components/DashboardHome";
import { DashboardAI } from "./components/DashboardAI";
import { DashboardTxs } from "./components/DashboardTxs";
import { DashboardWallet } from "./components/DashboardWallet";
import { DashboardSettings } from "./components/DashboardSettings";
import { DashboardDesignSystem } from "./components/DashboardDesignSystem";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "ai", Component: DashboardAI },
      { path: "txs", Component: DashboardTxs },
      { path: "wallet", Component: DashboardWallet },
      { path: "settings", Component: DashboardSettings },
      { path: "design-system", Component: DashboardDesignSystem },
    ],
  },
]);
