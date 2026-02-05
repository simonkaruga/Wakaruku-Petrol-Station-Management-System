import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalDeliveries: 0,
    totalExpenses: 0,
    totalCredit: 0
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Total Sales</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            KES {stats.totalSales.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Total Deliveries</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {stats.totalDeliveries}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            KES {stats.totalExpenses.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-medium">Total Credit</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            KES {stats.totalCredit.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
          <div className="space-y-4">
            {/* Sales list would go here */}
            <p className="text-gray-500">No recent sales data available</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Deliveries</h2>
          <div className="space-y-4">
            {/* Deliveries list would go here */}
            <p className="text-gray-500">No recent delivery data available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;