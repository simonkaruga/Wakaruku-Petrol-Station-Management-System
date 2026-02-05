import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">Petrol Station</h1>
        <nav className="space-y-2">
          <a href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </a>
          <a href="/shift-report" className="block py-2 px-4 rounded hover:bg-gray-700">
            Shift Report
          </a>
          <a href="/delivery" className="block py-2 px-4 rounded hover:bg-gray-700">
            Delivery
          </a>
          <a href="/credit" className="block py-2 px-4 rounded hover:bg-gray-700">
            Credit
          </a>
          <a href="/expenses" className="block py-2 px-4 rounded hover:bg-gray-700">
            Expenses
          </a>
          <a href="/reports" className="block py-2 px-4 rounded hover:bg-gray-700">
            Reports
          </a>
          <a href="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">
            Settings
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;