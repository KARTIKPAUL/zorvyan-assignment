"use client";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../lib/utils";

function SummaryCard({ label, value, icon, color, glowColor, delay, sub }) {
  return (
    <div
      className={`card fade-up ${delay}`}
      style={{
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Decorative glow */}
      <div style={{
        position: "absolute",
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: glowColor,
        filter: "blur(30px)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1.2 }}>
          {label}
        </div>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: glowColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
        }}>
          {icon}
        </div>
      </div>

      <div style={{
        fontSize: 28,
        fontWeight: 800,
        color,
        fontFamily: "var(--font-mono)",
        letterSpacing: "-1px",
        lineHeight: 1.1,
      }}>
        {value}
      </div>

      {sub && (
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function SummaryCards() {
  const { totals, transactions } = useApp();
  const txCount = transactions.length;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 16,
      marginBottom: 28,
    }}>
      <SummaryCard
        label="Total Balance"
        value={formatCurrency(totals.balance)}
        icon="◈"
        color={totals.balance >= 0 ? "var(--green)" : "var(--red)"}
        glowColor={totals.balance >= 0 ? "rgba(34,211,122,0.12)" : "rgba(242,92,92,0.12)"}
        delay="delay-1"
        sub="Net Income − Expenses"
      />
      <SummaryCard
        label="Total Income"
        value={formatCurrency(totals.income)}
        icon="↑"
        color="var(--green)"
        glowColor="rgba(34,211,122,0.12)"
        delay="delay-2"
        sub={`${transactions.filter(t => t.type === "income").length} transactions`}
      />
      <SummaryCard
        label="Total Expenses"
        value={formatCurrency(totals.expenses)}
        icon="↓"
        color="var(--red)"
        glowColor="rgba(242,92,92,0.12)"
        delay="delay-3"
        sub={`${transactions.filter(t => t.type === "expense").length} transactions`}
      />
      <SummaryCard
        label="Savings Rate"
        value={totals.income > 0 ? `${Math.round((totals.balance / totals.income) * 100)}%` : "—"}
        icon="◎"
        color="var(--accent)"
        glowColor="rgba(124,106,247,0.12)"
        delay="delay-4"
        sub={`${txCount} total transactions`}
      />
    </div>
  );
}