"use client";
import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate } from "../../lib/utils";
import { CATEGORIES, CATEGORY_COLORS } from "../../lib/mockData";
import AddTransactionModal from "./AddTransactionModal";

export default function TransactionsPage() {
  const { transactions, filters, setFilters, role, deleteTransaction } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filters.type !== "all") list = list.filter((t) => t.type === filters.type);
    if (filters.category !== "all") list = list.filter((t) => t.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    switch (filters.sort) {
      case "date-asc": list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case "amount-desc": list.sort((a, b) => b.amount - a.amount); break;
      case "amount-asc": list.sort((a, b) => a.amount - b.amount); break;
      default: list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return list;
  }, [transactions, filters]);

  const inputStyle = {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "9px 14px",
    color: "var(--text)",
    fontFamily: "var(--font-display)",
    fontSize: 13,
    outline: "none",
  };

  function exportCSV() {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filtered.map((t) => [t.date, t.description, t.category, t.type, t.amount]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Header bar */}
      <div className="card fade-up" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            style={{ ...inputStyle, flex: "1 1 180px", minWidth: 140 }}
            placeholder="🔍  Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />

          {[
            { key: "type", opts: ["all", "income", "expense"], label: "Type" },
          ].map(({ key, opts }) => (
            <select
              key={key}
              style={{ ...inputStyle, flex: "0 1 130px" }}
              value={filters[key]}
              onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
            >
              {opts.map((o) => <option key={o} value={o}>{key === "type" ? (o === "all" ? "All Types" : o.charAt(0).toUpperCase() + o.slice(1)) : o}</option>)}
            </select>
          ))}

          <select
            style={{ ...inputStyle, flex: "0 1 150px" }}
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          <select
            style={{ ...inputStyle, flex: "0 1 150px" }}
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>

          <button className="btn-ghost" onClick={exportCSV} style={{ fontSize: 12, whiteSpace: "nowrap" }}>
            ↓ CSV
          </button>

          {role === "admin" && (
            <button className="btn-primary" onClick={() => { setEditTx(null); setModalOpen(true); }} style={{ whiteSpace: "nowrap" }}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, paddingLeft: 4, fontFamily: "var(--font-mono)" }}>
        {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Table */}
      <div className="card fade-up delay-1" style={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>◌</div>
            <div style={{ color: "var(--text-muted)", fontSize: 14 }}>No transactions match your filters</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Date", "Description", "Category", "Type", "Amount", ...(role === "admin" ? ["Actions"] : [])].map((h) => (
                    <th key={h} style={{
                      padding: "12px 16px",
                      textAlign: h === "Amount" || h === "Actions" ? "right" : "left",
                      fontSize: 10,
                      fontFamily: "var(--font-mono)",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      color: "var(--text-muted)",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    style={{ borderBottom: "1px solid var(--border)", transition: "background 0.12s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {formatDate(tx.date)}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, maxWidth: 220 }}>
                      {tx.description}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: `${CATEGORY_COLORS[tx.category] || "#888"}18`,
                        color: CATEGORY_COLORS[tx.category] || "var(--text-sub)",
                        whiteSpace: "nowrap",
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: CATEGORY_COLORS[tx.category] || "#888", display: "inline-block" }} />
                        {tx.category}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className={tx.type === "income" ? "income-badge" : "expense-badge"}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, color: tx.type === "income" ? "var(--green)" : "var(--red)", whiteSpace: "nowrap" }}>
                      {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                    </td>
                    {role === "admin" && (
                      <td style={{ padding: "14px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          onClick={() => { setEditTx(tx); setModalOpen(true); }}
                          style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12, marginRight: 8, fontFamily: "var(--font-display)", fontWeight: 600 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => { if (confirm("Delete this transaction?")) deleteTransaction(tx.id); }}
                          style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddTransactionModal open={modalOpen} onClose={() => { setModalOpen(false); setEditTx(null); }} editTx={editTx} />
    </div>
  );
}