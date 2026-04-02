"use client";
import { useApp } from "../../context/AppContext";
import { groupByCategory } from "../../lib/utils";
import { CATEGORY_COLORS } from "../../lib/mockData";
import { formatCurrency } from "../../lib/utils";

function DonutChart({ data, total }) {
  const SIZE = 160;
  const R = 60;
  const STROKE = 22;
  const cx = SIZE / 2, cy = SIZE / 2;
  const circumference = 2 * Math.PI * R;

  let offset = 0;
  const slices = data.slice(0, 6).map((d) => {
    const pct = d.amount / total;
    const slice = { ...d, pct, offset, dashArray: `${pct * circumference} ${circumference}` };
    offset += pct * circumference;
    return slice;
  });

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0 }}>
      <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={CATEGORY_COLORS[s.category] || "#888"}
            strokeWidth={STROKE}
            strokeDasharray={s.dashArray}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        ))}
      </svg>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Total</div>
        <div style={{ fontSize: 14, fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--red)" }}>
          {formatCurrency(total).replace("₹", "₹")}
        </div>
      </div>
    </div>
  );
}

export default function SpendingBreakdown() {
  const { transactions } = useApp();
  const grouped = groupByCategory(transactions);
  const total = grouped.reduce((s, d) => s + d.amount, 0);

  if (!grouped.length) {
    return (
      <div className="card fade-up delay-2" style={{ padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Spending Breakdown</div>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 40, textAlign: "center" }}>No expense data</div>
      </div>
    );
  }

  return (
    <div className="card fade-up delay-2" style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Spending Breakdown</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>By category</div>
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <DonutChart data={grouped} total={total} />

        <div style={{ flex: 1, minWidth: 140 }}>
          {grouped.slice(0, 6).map((d) => (
            <div key={d.category} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: CATEGORY_COLORS[d.category] || "#888",
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 12, color: "var(--text-sub)" }}>{d.category}</span>
              </div>
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                {Math.round((d.amount / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}