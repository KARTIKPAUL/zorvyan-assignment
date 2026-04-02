"use client";
import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../lib/mockData";

const INITIAL_FORM = { date: new Date().toISOString().slice(0, 10), description: "", amount: "", category: "Food & Dining", type: "expense" };

export default function AddTransactionModal({ open, onClose, editTx }) {
  const { addTransaction, editTransaction } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editTx) setForm({ ...editTx, amount: String(editTx.amount) });
    else setForm(INITIAL_FORM);
    setError("");
  }, [editTx, open]);

  if (!open) return null;

  function handleSubmit() {
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) return setError("Enter a valid amount.");
    const tx = { ...form, amount: Number(form.amount) };
    if (editTx) editTransaction(editTx.id, tx);
    else addTransaction(tx);
    onClose();
  }

  const field = {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "var(--text)",
    fontFamily: "var(--font-display)",
    fontSize: 14,
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ width: "100%", maxWidth: 440, padding: 28, background: "var(--bg2)", animation: "fadeUp 0.2s ease both" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>{editTx ? "Edit Transaction" : "New Transaction"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {error && (
          <div style={{ background: "rgba(242,92,92,0.1)", border: "1px solid rgba(242,92,92,0.3)", borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: 13, color: "var(--red)" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Description</label>
            <input
              style={field}
              placeholder="e.g. Monthly Salary"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Amount (₹)</label>
              <input
                style={field}
                type="number"
                placeholder="0"
                min="0"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Date</label>
              <input
                style={field}
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 6 }}>Category</label>
            <select
              style={field}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Type</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["expense", "income"].map((type) => (
                <button
                  key={type}
                  onClick={() => setForm((f) => ({ ...f, type }))}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor: form.type === type
                      ? type === "income" ? "var(--green)" : "var(--red)"
                      : "var(--border)",
                    background: form.type === type
                      ? type === "income" ? "rgba(34,211,122,0.1)" : "rgba(242,92,92,0.1)"
                      : "transparent",
                    color: form.type === type
                      ? type === "income" ? "var(--green)" : "var(--red)"
                      : "var(--text-muted)",
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}
                >
                  {type === "income" ? "↑" : "↓"} {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} style={{ flex: 2 }}>
            {editTx ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}