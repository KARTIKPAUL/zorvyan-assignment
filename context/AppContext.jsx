"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_TRANSACTIONS } from "../lib/mockData";
import { getTotals } from "../lib/utils";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [role, setRole] = useState("admin");
  const [filters, setFilters] = useState({ type: "all", category: "all", search: "", sort: "date-desc" });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("fin_transactions");
    const savedRole = localStorage.getItem("fin_role");
    const savedDark = localStorage.getItem("fin_dark");
    setTransactions(saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS);
    if (savedRole) setRole(savedRole);
    if (savedDark !== null) setDarkMode(JSON.parse(savedDark));
  }, []);

  useEffect(() => {
    if (transactions.length) localStorage.setItem("fin_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("fin_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("fin_dark", JSON.stringify(darkMode));
    // Toggle .light class on <html>; dark is the default (no class needed)
    if (darkMode) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
    // Also update body background so it transitions smoothly
    document.body.style.background = "var(--bg)";
    document.body.style.color = "var(--text)";
  }, [darkMode]);

  function addTransaction(tx) {
    const newTx = { ...tx, id: Date.now() };
    setTransactions((prev) => [newTx, ...prev]);
  }

  function editTransaction(id, updated) {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const totals = getTotals(transactions);

  return (
    <AppContext.Provider value={{ transactions, role, setRole, filters, setFilters, activeTab, setActiveTab, darkMode, setDarkMode, addTransaction, editTransaction, deleteTransaction, totals }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}