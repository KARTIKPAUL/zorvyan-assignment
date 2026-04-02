"use client";
import { useApp } from "../../context/AppContext";
import { groupByCategory, formatCurrency, getTotals } from "../../lib/utils";
import { CATEGORY_COLORS, MONTHLY_DATA } from "../../lib/mockData";

function InsightCard({ icon, title, value, sub, color, delay }) {
  return (
    <div className={`card fade-up ${delay}`} style={{ padding: 24 }}>
      <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || "var(--text)", fontFamily: "var(--font-mono)", letterSpacing: "-0.5px", marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

function MonthlyBar({ label, income, expenses, maxVal }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
        <span style={{ fontWeight: 700 }}>{label}</span>
        <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
          <span style={{ color: "var(--green)" }}>+{formatCurrency(income)}</span>
          <span style={{ color: "var(--red)" }}>−{formatCurrency(expenses)}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {[{ val: income, color: "var(--green)" }, { val: expenses, color: "var(--red)" }].map(({ val, color }, i) => (
          <div key={i} style={{ height: 6, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(val / maxVal) * 100}%`,
              background: color,
              borderRadius: 3,
              transition: "width 0.8s ease",
              opacity: 0.85,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { transactions } = useApp();
  const grouped = groupByCategory(transactions);
  const totals = getTotals(transactions);
  const maxCategory = grouped[0];
  const savingsRate = totals.income > 0 ? ((totals.balance / totals.income) * 100).toFixed(1) : 0;
  const avgExpense = transactions.filter(t => t.type === "expense").reduce((s, t, _, arr) => s + t.amount / arr.length, 0);

  const maxMonthly = Math.max(...MONTHLY_DATA.flatMap((d) => [d.income, d.expenses]));
  const bestMonth = MONTHLY_DATA.reduce((best, m) => m.balance > best.balance ? m : best, MONTHLY_DATA[0]);

  const monthlyIncome = MONTHLY_DATA.slice(-2);
  const incomeGrowth = monthlyIncome.length === 2
    ? (((monthlyIncome[1].income - monthlyIncome[0].income) / monthlyIncome[0].income) * 100).toFixed(1)
    : 0;

  return (
    <div>
      {/* Key insights grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <InsightCard
          icon="🏆"
          title="Top Spending Category"
          value={maxCategory?.category || "—"}
          sub={maxCategory ? `${formatCurrency(maxCategory.amount)} total spent` : "No expense data"}
          color={CATEGORY_COLORS[maxCategory?.category] || "var(--text)"}
          delay="delay-1"
        />
        <InsightCard
          icon="📈"
          title="Savings Rate"
          value={`${savingsRate}%`}
          sub={`${formatCurrency(totals.balance)} saved overall`}
          color={savingsRate >= 20 ? "var(--green)" : savingsRate >= 10 ? "var(--gold)" : "var(--red)"}
          delay="delay-2"
        />
        <InsightCard
          icon="📊"
          title="Avg. Transaction"
          value={formatCurrency(Math.round(avgExpense))}
          sub="Per expense transaction"
          color="var(--accent)"
          delay="delay-3"
        />
        <InsightCard
          icon="🌟"
          title="Best Month"
          value={bestMonth.month}
          sub={`Saved ${formatCurrency(bestMonth.balance)}`}
          color="var(--gold)"
          delay="delay-4"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Monthly comparison */}
        <div className="card fade-up delay-2" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Monthly Comparison</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Income vs expenses per month</div>
          </div>
          {MONTHLY_DATA.map((d) => (
            <MonthlyBar key={d.month} label={d.month} income={d.income} expenses={d.expenses} maxVal={maxMonthly} />
          ))}
        </div>

        {/* Category breakdown */}
        <div className="card fade-up delay-3" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Spending by Category</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>All time breakdown</div>
          </div>
          <div>
            {grouped.map((d, i) => {
              const pct = totals.expenses > 0 ? (d.amount / totals.expenses) * 100 : 0;
              return (
                <div key={d.category} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLORS[d.category] || "#888", flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{d.category}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                      <span>{formatCurrency(d.amount)}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{pct.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: CATEGORY_COLORS[d.category] || "#888",
                      borderRadius: 3,
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                </div>
              );
            })}
            {grouped.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, padding: "40px 0" }}>No expense data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Smart observations */}
      <div className="card fade-up delay-4" style={{ padding: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Smart Observations</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            savingsRate >= 20
              ? { icon: "✅", text: `Excellent! Your savings rate of ${savingsRate}% exceeds the recommended 20% threshold.`, color: "var(--green)" }
              : { icon: "⚠️", text: `Your savings rate of ${savingsRate}% is below the recommended 20%. Consider reducing discretionary spending.`, color: "var(--gold)" },
            maxCategory
              ? { icon: "📌", text: `"${maxCategory.category}" is your biggest expense category at ${formatCurrency(maxCategory.amount)}.`, color: "var(--accent)" }
              : null,
            incomeGrowth > 0
              ? { icon: "📈", text: `Income grew by ${incomeGrowth}% from ${MONTHLY_DATA.at(-2)?.month} to ${MONTHLY_DATA.at(-1)?.month}.`, color: "var(--green)" }
              : incomeGrowth < 0
              ? { icon: "📉", text: `Income dropped by ${Math.abs(incomeGrowth)}% last month. Worth reviewing your income sources.`, color: "var(--red)" }
              : null,
            { icon: "💡", text: `Your average expense transaction is ${formatCurrency(Math.round(avgExpense))}. Tracking smaller habits can compound savings.`, color: "var(--text-sub)" },
          ].filter(Boolean).map((obs, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", borderRadius: 10, background: "var(--bg3)", border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 18 }}>{obs.icon}</span>
              <p style={{ fontSize: 13, color: obs.color, lineHeight: 1.6 }}>{obs.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}