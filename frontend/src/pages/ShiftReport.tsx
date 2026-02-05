import React, { useState, useEffect } from 'react';

const ShiftReport = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await fetch('/api/shifts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setShifts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      setLoading(false);
    }
  };

  const handleStartShift = async () => {
    try {
      await fetch('/api/shifts/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      fetchShifts();
    } catch (error) {
      console.error('Error starting shift:', error);
    }
  };

  const handleEndShift = async (shiftId) => {
    try {
      await fetch(`/api/shifts/${shiftId}/end`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      fetchShifts();
    } catch (error) {
      console.error('Error ending shift:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading shifts...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shift Reports</h1>
        <button
          onClick={handleStartShift}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start New Shift
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shift ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {shift.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(shift.startTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {shift.endTime ? new Date(shift.endTime).toLocaleString() : 'Active'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    shift.endTime ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {shift.endTime ? 'Closed' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!shift.endTime && (
                    <button
                      onClick={() => handleEndShift(shift.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      End Shift
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftReport;