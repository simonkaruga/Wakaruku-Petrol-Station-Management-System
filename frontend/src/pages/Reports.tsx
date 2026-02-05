import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    reportType: 'sales'
  });

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/${filters.reportType}?startDate=${filters.startDate}&endDate=${filters.endDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate default sales report
    generateReport();
  }, []);

  const exportToCSV = () => {
    if (!reportData) return;

    const headers = Object.keys(reportData.data[0] || {});
    const csvContent = [
      headers.join(','),
      ...reportData.data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filters.reportType}-report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Generate Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters({...filters, reportType: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="sales">Sales Report</option>
              <option value="deliveries">Delivery Report</option>
              <option value="expenses">Expense Report</option>
              <option value="credit">Credit Report</option>
              <option value="inventory">Inventory Report</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {reportData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {reportData.title} - {new Date(reportData.generatedAt).toLocaleDateString()}
            </h2>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Export to CSV
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {reportData.summary && Object.entries(reportData.summary).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600">{key}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(reportData.data[0] || {}).map((key) => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;