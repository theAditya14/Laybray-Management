import React, { useState } from "react";

// API Base URL - matches the backend server
const API_URL = "http://localhost:3000";

export default function StudentForm({ onStudentAdded }) {
  const [student, setStudent] = useState({
    date: "",
    name: "",
    mobile: "",
    seat: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission - sends data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validate required fields
      if (!student.date || !student.name || !student.mobile || !student.seat) {
        setError("All fields are required!");
        return;
      }

      // Send POST request to backend
      const response = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...student,
          feeStatus: "due", // New students are marked as due by default
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add student: ${response.statusText}`);
      }

      const data = await response.json();

      // Show success message
      setSuccess(true);

      // Reset form
      setStudent({ date: "", name: "", mobile: "", seat: "", amount: "" });

      // Tell parent to refresh everything
      if (typeof onStudentAdded === 'function') onStudentAdded();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error("Error adding student:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">New student entry</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Add a student record</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Fill out the form below to register a student. New entries are created with a due fee status.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-4xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/30"
        >
          <div>
            <h2 className="text-2xl font-semibold text-white">Student details</h2>
            <p className="mt-2 text-sm text-slate-400">Provide the student information and seat number.</p>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              Student added successfully!
            </div>
          )}

          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Date</label>
              <input
                type="date"
                name="date"
                value={student.date}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Student Name</label>
              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleChange}
                placeholder="Enter student name"
                className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={student.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Seat Number</label>
              <input
                type="text"
                name="seat"
                value={student.seat}
                onChange={handleChange}
                placeholder="Enter seat number"
                className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-slate-500 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-400"
            }`}
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
}