"use client";
import { useApp } from "../../context/AppContext";

const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "transactions", icon: "↕", label: "Transactions" },
  { id: "insights", icon: "◈", label: "Insights" },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, darkMode, setDarkMode, role, setRole } = useApp();

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "var(--bg2)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "28px 16px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 40, paddingLeft: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.5px" }}>
          Fin<span style={{ color: "var(--text)" }}>Flow</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
          Finance Dashboard
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {NAV.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#fff" : "var(--text-sub)",
                fontFamily: "var(--font-display)",
                fontWeight: active ? 700 : 500,
                fontSize: 14,
                transition: "all 0.18s",
                textAlign: "left",
                boxShadow: active ? "0 4px 16px var(--accent-glow)" : "none",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-sub)"; } }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Role switcher */}
      <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, paddingLeft: 4, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1 }}>
          Role
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--text)",
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          <option value="admin">👑 Admin</option>
          <option value="viewer">👁 Viewer</option>
        </select>

        <button
          onClick={() => setDarkMode((d) => !d)}
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--text-sub)",
            fontFamily: "var(--font-display)",
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s",
          }}
        >
          {darkMode ? "☀ Light Mode" : "☾ Dark Mode"}
        </button>
      </div>
    </aside>
  );
}