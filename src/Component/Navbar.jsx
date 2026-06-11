import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const items = [
    { name: "Dashboard", element: "/" },
    { name: "Add Student", element: "/StudentForm" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
            LB
          </div>
          <div>
            <p className="text-sm text-slate-400">Library Admin</p>
            <h1 className="text-xl font-semibold tracking-tight text-white">Laybray Management</h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {items.map((item) => {
            const active = location.pathname === item.element;
            return (
              <Link
                key={item.element}
                to={item.element}
                className={
                  "rounded-3xl px-4 py-2 text-sm font-medium transition-all duration-300 " +
                  (active
                    ? "bg-slate-100 text-slate-950 shadow-lg shadow-slate-800/10"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white hover:-translate-y-0.5")
                }
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <button
          className="md:hidden rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition-all duration-300"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        {open && (
          <div className="md:hidden mt-3 w-full rounded-3xl bg-slate-900 p-4 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-2">
              {items.map((item) => {
                const active = location.pathname === item.element;
                return (
                  <Link
                    key={item.element}
                    to={item.element}
                    onClick={() => setOpen(false)}
                    className={
                      "block rounded-2xl px-4 py-3 text-sm transition-all duration-300 " +
                      (active ? "bg-slate-100 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white")
                    }
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;