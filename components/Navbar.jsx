import React from "react";
import { CircleUser } from "lucide-react";

export default function Navbar({ user, handleLogout, handleDownloadExcel }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-indigo-700 text-white shadow-md mb-6">
      <h1 className="text-xl font-bold">📊 Sales Analytics Portal</h1>
      <div className="flex gap-4 items-center">
        <CircleUser className="w-5 h-10 text-white" />
        <span>{user.username || user.name || user.homeAccountId}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
        <button
          onClick={handleDownloadExcel}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          ⬇ Download Excel
        </button>
      </div>
    </nav>
  );
}
