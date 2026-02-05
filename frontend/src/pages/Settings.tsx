import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    stationName: '',
    location: '',
    currency: 'KES',
    taxRate: 0,
    businessHours: {
      open: '06:00',
      close: '22:00'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings');
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Station Name</label>
              <input
                type="text"
                value={settings.stationName}
                onChange={(e) => setSettings({...settings, stationName: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({...settings, location: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.taxRate}
                onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Opening Time</label>
                <input
                  type="time"
                  value={settings.businessHours.open}
                  onChange={(e) => setSettings({
                    ...settings, 
                    businessHours: {...settings.businessHours, open: e.target.value}
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Closing Time</label>
                <input
                  type="time"
                  value={settings.businessHours.close}
                  onChange={(e) => setSettings({
                    ...settings, 
                    businessHours: {...settings.businessHours, close: e.target.value}
                  })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;