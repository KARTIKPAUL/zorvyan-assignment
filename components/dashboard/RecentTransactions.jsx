"use client";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate } from "../../lib/utils";
import { CATEGORY_COLORS } from "../../lib/mockData";

export default function RecentTransactions() {
  const { transactions, setActiveTab } = useApp();
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  return (
    <div className="card fade-up delay-3" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Recent Activity</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Latest 6 transactions</div>
        </div>
        <button className="btn-ghost" onClick={() => setActiveTab("transactions")} style={{ fontSize: 12 }}>
          View All →
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {recent.map((tx) => (
          <div
            key={tx.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 12px",
              borderRadius: 10,
              transition: "background 0.15s",
              cursor: "default",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: CATEGORY_COLORS[tx.category] || "#888",
                boxShadow: `0 0 6px ${CATEGORY_COLORS[tx.category] || "#888"}`,
              }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>{tx.description}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {tx.category} · {formatDate(tx.date)}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color: tx.type === "income" ? "var(--green)" : "var(--red)",
            }}>
              {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}