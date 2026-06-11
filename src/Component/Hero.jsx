import React, { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaUserGraduate,
  FaMoneyBillWave,
  FaCheckCircle,
  FaExclamationCircle,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

const API_URL = "http://localhost:3000";

export default function Hero({ students, feeComplete, paymentHistory = [], loading, error, refreshAllData }) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", mobile: "", seat: "" });
  const [loadingIds, setLoadingIds] = useState(new Set());

  useEffect(() => {
    if (!editingId) setEditForm({ name: "", mobile: "", seat: "" });
  }, [editingId]);

  const filterList = (list) => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((s) => {
      return (
        s.name.toLowerCase().includes(q) ||
        s.mobile.toLowerCase().includes(q) ||
        (s.seat + "").toLowerCase().includes(q)
      );
    });
  };

  const dueFiltered = useMemo(() => filterList(students), [query, students]);
  const completeFiltered = useMemo(() => filterList(feeComplete), [query, feeComplete]);

  const allStudents = useMemo(() => [...feeComplete, ...students], [feeComplete, students]);
  const totalStudents = allStudents.length;
  const dueCount = students.length;
  const completeCount = feeComplete.length;

  const todayLabel = new Date().toISOString().slice(0, 10);
  const todaysCollection = paymentHistory
    .filter((r) => r.paidDate === todayLabel)
    .reduce((s, r) => s + (Number(r.amount) || 0), 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyCollection = paymentHistory
    .filter((r) => {
      if (!r.paidDate) return false;
      const d = new Date(r.paidDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((s, r) => s + (Number(r.amount) || 0), 0);

  const handleMarkComplete = async (studentId) => {
    try {
      setLoadingIds((prev) => new Set(prev).add(studentId));
      const res = await fetch(`${API_URL}/students/${studentId}/complete`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed");
      await refreshAllData();
    } catch (err) {
      console.error(err);
      alert("Failed to mark complete");
    } finally {
      setLoadingIds((prev) => { const s = new Set(prev); s.delete(studentId); return s; });
    }
  };

  const handleDelete = async (studentId) => {
    if (!confirm("Delete this student?")) return;
    try {
      setLoadingIds((prev) => new Set(prev).add(studentId));
      const res = await fetch(`${API_URL}/students/${studentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      await refreshAllData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    } finally {
      setLoadingIds((prev) => { const s = new Set(prev); s.delete(studentId); return s; });
    }
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditForm({ name: s.name, mobile: s.mobile, seat: s.seat });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    try {
      setLoadingIds((prev) => new Set(prev).add(editingId));
      const res = await fetch(`${API_URL}/students/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditingId(null);
      await refreshAllData();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setLoadingIds((prev) => { const s = new Set(prev); s.delete(editingId); return s; });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/10 transition-all duration-300">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Library Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Manage students & fee payments</h1>
              <p className="mt-2 text-slate-600">Track dues, payments, and student records in one elegant dashboard.</p>
            </div>
            <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Today</p>
              <p className="mt-1 text-3xl font-semibold">₹{todaysCollection}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg shadow-slate-950/20">
                <FaUserGraduate className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total Students</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-xl shadow-red-200/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-600 text-white shadow-lg shadow-red-500/20">
                <FaExclamationCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Fee Due</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{dueCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-200/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                <FaCheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Fee Complete</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{completeCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <FaMoneyBillWave className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Monthly Collection</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">₹{monthlyCollection}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/10 transition-all duration-300 hover:-translate-y-1">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Student search</p>
              <p className="mt-1 text-slate-600">Search by student name, mobile number, or seat number.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-96">
                <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search students"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800 active:scale-95"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-red-100 bg-white shadow-xl shadow-red-200/10 transition-all duration-300 hover:-translate-y-1">
            <div className="rounded-t-3xl bg-red-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-red-100">Fee Due</p>
                  <h2 className="mt-2 text-2xl font-semibold">Pending payments</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-700 shadow-lg shadow-red-700/20">
                  <FaExclamationCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="px-4 py-5 sm:px-6">
              {dueFiltered.length === 0 ? (
                <p className="rounded-3xl bg-red-50 p-6 text-center text-sm text-red-600">No pending payments.</p>
              ) : (
                <div className="space-y-3">
                  {dueFiltered.map((s, index) => (
                    <div
                      key={s.id}
                      className={`group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${index % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
                    >
                      <div className="grid gap-3 sm:grid-cols-[1.3fr_1.3fr_1fr] lg:grid-cols-[1.4fr_1.2fr_0.8fr] items-center">
                        <div>
                          <p className="text-sm text-slate-500">Name</p>
                          <p className="mt-1 text-base font-semibold text-slate-900">{s.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Mobile</p>
                          <p className="mt-1 text-base text-slate-900">{s.mobile}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Seat</p>
                          <p className="mt-1 text-base text-slate-900">{s.seat}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                            <FaExclamationCircle className="h-4 w-4" /> Due
                          </span>
                          <span className="text-sm text-slate-500">{s.date}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleMarkComplete(s.id)}
                            disabled={loadingIds.has(s.id)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            <FaCheckCircle /> {loadingIds.has(s.id) ? "..." : "Done"}
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(s)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-200 active:scale-95"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(s.id)}
                            disabled={loadingIds.has(s.id)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                      {editingId === s.id && (
                        <div className="mt-4 grid gap-3 lg:grid-cols-3">
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                          <input
                            value={editForm.mobile}
                            onChange={(e) => setEditForm((p) => ({ ...p, mobile: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                          <input
                            value={editForm.seat}
                            onChange={(e) => setEditForm((p) => ({ ...p, seat: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      )}
                      {editingId === s.id && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={loadingIds.has(s.id)}
                            className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            Save changes
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex items-center justify-center rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-200 active:scale-95"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-200/10 transition-all duration-300 hover:-translate-y-1">
            <div className="rounded-t-3xl bg-emerald-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-100">Fee Complete</p>
                  <h2 className="mt-2 text-2xl font-semibold">Paid students</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-700 shadow-lg shadow-emerald-700/20">
                  <FaCheckCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="px-4 py-5 sm:px-6">
              {completeFiltered.length === 0 ? (
                <p className="rounded-3xl bg-emerald-50 p-6 text-center text-sm text-emerald-700">No completed payments yet.</p>
              ) : (
                <div className="space-y-3">
                  {completeFiltered.map((s, index) => (
                    <div
                      key={s.id}
                      className={`group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${index % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
                    >
                      <div className="grid gap-3 sm:grid-cols-[1.3fr_1.3fr_1fr] lg:grid-cols-[1.4fr_1.2fr_0.8fr] items-center">
                        <div>
                          <p className="text-sm text-slate-500">Name</p>
                          <p className="mt-1 text-base font-semibold text-slate-900">{s.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Mobile</p>
                          <p className="mt-1 text-base text-slate-900">{s.mobile}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Seat</p>
                          <p className="mt-1 text-base text-slate-900">{s.seat}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                            <FaCheckCircle className="h-4 w-4" /> Complete
                          </span>
                          <span className="text-sm text-slate-500">{s.date}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(s)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-200 active:scale-95"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(s.id)}
                            disabled={loadingIds.has(s.id)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                      {editingId === s.id && (
                        <div className="mt-4 grid gap-3 lg:grid-cols-3">
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                          <input
                            value={editForm.mobile}
                            onChange={(e) => setEditForm((p) => ({ ...p, mobile: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                          <input
                            value={editForm.seat}
                            onChange={(e) => setEditForm((p) => ({ ...p, seat: e.target.value }))}
                            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      )}
                      {editingId === s.id && (
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={loadingIds.has(s.id)}
                            className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            Save changes
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex items-center justify-center rounded-3xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-200 active:scale-95"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
