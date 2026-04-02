"use client";
import { MONTHLY_DATA } from "../../lib/mockData";
import { formatCurrency } from "../../lib/utils";

export default function BalanceTrendChart() {
  const data = MONTHLY_DATA;
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]));
  const W = 480, H = 180, PAD = 40;
  const chartW = W - PAD * 2;
  const chartH = H - PAD * 1.5;

  function x(i) { return PAD + (i / (data.length - 1)) * chartW; }
  function y(val) { return PAD + chartH - (val / maxVal) * chartH; }

  function makePath(key) {
    return data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d[key])}`).join(" ");
  }

  function makeArea(key) {
    const pts = data.map((d, i) => `${x(i)} ${y(d[key])}`).join(" L ");
    return `M ${x(0)} ${y(data[0][key])} L ${pts} L ${x(data.length - 1)} ${H - PAD / 2} L ${x(0)} ${H - PAD / 2} Z`;
  }

  const incomePoints = data.map((d, i) => `${x(i)},${y(d.income)}`).join(" ");
  const expensePoints = data.map((d, i) => `${x(i)},${y(d.expenses)}`).join(" ");

  return (
    <div className="card fade-up delay-1" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Monthly Trend</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Income vs Expenses</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[["Income", "var(--green)"], ["Expenses", "var(--red)"]].map(([label, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 20, height: 2, background: color, borderRadius: 1 }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 320, height: "auto" }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d37a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d37a" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f25c5c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f25c5c" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <g key={i}>
              <line
                x1={PAD} y1={PAD + chartH - ratio * chartH}
                x2={W - PAD} y2={PAD + chartH - ratio * chartH}
                stroke="var(--border)" strokeWidth="1"
              />
              <text
                x={PAD - 6} y={PAD + chartH - ratio * chartH + 4}
                textAnchor="end"
                fill="var(--text-muted)"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
              >
                {Math.round(maxVal * ratio / 1000)}k
              </text>
            </g>
          ))}

          {/* Area fills */}
          <path d={makeArea("income")} fill="url(#incomeGrad)" />
          <path d={makeArea("expenses")} fill="url(#expenseGrad)" />

          {/* Lines */}
          <path d={makePath("income")} fill="none" stroke="#22d37a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={makePath("expenses")} fill="none" stroke="#f25c5c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points + labels */}
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(d.income)} r="4" fill="#22d37a" />
              <circle cx={x(i)} cy={y(d.expenses)} r="4" fill="#f25c5c" />
              <text x={x(i)} y={H - 6} textAnchor="middle" fill="var(--text-muted)" style={{ fontSize: 10, fontFamily: "var(--font-mono)" }}>
                {d.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}