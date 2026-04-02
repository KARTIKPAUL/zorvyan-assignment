"use client";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../lib/utils";

const TAB_LABELS = {
  dashboard: "Overview",
  transactions: "Transactions",
  insights: "Insights",
};

export default function Header() {
  const { activeTab, totals, role, darkMode, setDarkMode } = useApp();

  return (
    <header
      style={{
        padding: "20px 32px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 9,
        backdropFilter: "blur(12px)",
      }}
    >
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.3px" }}>
          {TAB_LABELS[activeTab]}
        </h1>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Net Balance */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1 }}>Net Balance</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: totals.balance >= 0 ? "var(--green)" : "var(--red)", fontFamily: "var(--font-mono)" }}>
            {formatCurrency(totals.balance)}
          </div>
        </div>

        {/* Role badge */}
        <div style={{
          padding: "6px 14px",
          borderRadius: 20,
          background: role === "admin" ? "rgba(124,106,247,0.15)" : "rgba(34,211,122,0.12)",
          color: role === "admin" ? "var(--accent)" : "var(--green)",
          fontSize: 12,
          fontWeight: 700,
          border: `1px solid ${role === "admin" ? "rgba(124,106,247,0.3)" : "rgba(34,211,122,0.25)"}`,
          fontFamily: "var(--font-mono)",
          letterSpacing: 0.5,
          whiteSpace: "nowrap",
        }}>
          {role === "admin" ? "👑 ADMIN" : "👁 VIEWER"}
        </div>

        {/* Dark / Light toggle */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 14px",
            borderRadius: 20,
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--text-sub)",
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-hover)";
            e.currentTarget.style.color = "var(--text)";
            e.currentTarget.style.background = "var(--card-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-sub)";
            e.currentTarget.style.background = "var(--card)";
          }}
        >
          {/* Animated pill track */}
          <div style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            background: darkMode ? "var(--accent)" : "var(--border-hover)",
            position: "relative",
            transition: "background 0.3s",
            flexShrink: 0,
          }}>
            <div style={{
              position: "absolute",
              top: 3,
              left: darkMode ? 18 : 3,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#fff",
              transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }} />
          </div>
          {darkMode ? "Dark" : "Light"}
        </button>
      </div>
    </header>
  );
}