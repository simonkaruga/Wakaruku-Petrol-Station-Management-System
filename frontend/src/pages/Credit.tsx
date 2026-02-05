import React, { useState, useEffect } from 'react';

const Credit = () => {
  const [creditTransactions, setCreditTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    description: '',
    type: 'credit'
  });

  useEffect(() => {
    fetchCreditTransactions();
    fetchCustomers();
  }, []);

  const fetchCreditTransactions = async () => {
    try {
      const response = await fetch('/api/credit', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCreditTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching credit transactions:', error);
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/credit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      setFormData({ customerId: '', amount: '', description: '', type: 'credit' });
      fetchCreditTransactions();
    } catch (error) {
      console.error('Error creating credit transaction:', error);
    }
  };

  const handlePayment = async (transactionId, amount) => {
    try {
      await fetch(`/api/credit/${transactionId}/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });
      fetchCreditTransactions();
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading credit transactions...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Add Credit Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="credit">Credit Sale</option>
                <option value="payment">Payment Received</option>
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
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                rows="3"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Add Transaction
            </button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Credit Ledger</h2>
          <div className="space-y-4">
            {creditTransactions.map(transaction => (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{transaction.customer?.name}</h3>
                    <p className="text-sm text-gray-600">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'credit' ? '-' : '+'} KES {transaction.amount.toLocaleString()}
                    </p>
                    {transaction.type === 'credit' && transaction.balance !== undefined && (
                      <p className="text-sm text-gray-600">
                        Balance: KES {transaction.balance.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                {transaction.type === 'credit' && (
                  <div className="mt-2">
                    <button
                      onClick={() => handlePayment(transaction.id, transaction.amount)}
                      className="text-sm bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Record Payment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credit;