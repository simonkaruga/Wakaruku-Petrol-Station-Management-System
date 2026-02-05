import React, { useState, useEffect } from 'react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setExpenses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      setFormData({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
      fetchExpenses();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading expenses...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select a category</option>
                <option value="utilities">Utilities</option>
                <option value="maintenance">Maintenance</option>
                <option value="supplies">Office Supplies</option>
                <option value="salaries">Salaries</option>
                <option value="rent">Rent</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Add Expense
            </button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
          <div className="space-y-4">
            {expenses.map(expense => (
              <div key={expense.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{expense.description}</h3>
                    <p className="text-sm text-gray-600 capitalize">{expense.category}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      - KES {expense.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;