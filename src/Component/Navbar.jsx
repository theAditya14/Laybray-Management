import React from "react";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1 className="text-xl font-bold">
          Student Manager
        </h1>

        <ul className="flex gap-6">
          <li>
            <a
              href="/"
              className="hover:text-blue-400 transition-colors"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="/add-student"
              className="hover:text-blue-400 transition-colors"
            >
              Add New Student
            </a>
          </li>
        </ul>

      </div>
    </nav>
  );
}

export default Navbar;