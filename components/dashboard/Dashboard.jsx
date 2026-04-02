"use client";
import SummaryCards from "./SummaryCards";
import BalanceTrendChart from "./BalanceTrendChart";
import SpendingBreakdown from "./SpendingBreakdown";
import RecentTransactions from "./RecentTransactions";

export default function Dashboard() {
  return (
    <div>
      <SummaryCards />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}>
        <BalanceTrendChart />
        <SpendingBreakdown />
      </div>

      <RecentTransactions />

      <style>{`
        @media (max-width: 900px) {
          .chart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}