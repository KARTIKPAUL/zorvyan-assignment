export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getMonthName(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function groupByCategory(transactions) {
  const expense = transactions.filter((t) => t.type === "expense");
  const groups = {};
  expense.forEach((t) => {
    groups[t.category] = (groups[t.category] || 0) + t.amount;
  });
  return Object.entries(groups)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function getTotals(transactions) {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}