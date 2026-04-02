"use client";
import { useApp } from "../../context/AppContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../dashboard/Dashboard";
import TransactionsPage from "../transactions/TransactionsPage";
import InsightsPage from "../insights/InsightsPage";

export default function AppShell() {
  const { activeTab, darkMode } = useApp();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <div className="bg-blob" />

      {/* Sidebar hidden on mobile */}
      <div style={{ display: "flex" }} className="sidebar-wrapper">
        <Sidebar />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />
        <main style={{ flex: 1, padding: "28px 32px", position: "relative", zIndex: 1 }}>
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "transactions" && <TransactionsPage />}
          {activeTab === "insights" && <InsightsPage />}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrapper { display: none !important; }
          main { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}