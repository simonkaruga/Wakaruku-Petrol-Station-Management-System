import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          Wakaruku Petrol Station
        </div>
        <div className="flex space-x-4">
          <a href="/dashboard" className="hover:text-blue-200">Dashboard</a>
          <a href="/shift-report" className="hover:text-blue-200">Shift Report</a>
          <a href="/delivery" className="hover:text-blue-200">Delivery</a>
          <a href="/credit" className="hover:text-blue-200">Credit</a>
          <a href="/expenses" className="hover:text-blue-200">Expenses</a>
          <a href="/reports" className="hover:text-blue-200">Reports</a>
          <a href="/settings" className="hover:text-blue-200">Settings</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;