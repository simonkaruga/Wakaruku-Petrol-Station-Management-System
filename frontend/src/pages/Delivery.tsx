import React, { useState, useEffect } from 'react';

const Delivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    supplier: '',
    cost: ''
  });

  useEffect(() => {
    fetchDeliveries();
    fetchProducts();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setDeliveries(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/deliveries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      setFormData({ productId: '', quantity: '', supplier: '', cost: '' });
      fetchDeliveries();
    } catch (error) {
      console.error('Error creating delivery:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading deliveries...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Add New Delivery</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost (KES)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Add Delivery
            </button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Deliveries</h2>
          <div className="space-y-4">
            {deliveries.map(delivery => (
              <div key={delivery.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{delivery.product?.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {delivery.quantity}</p>
                    <p className="text-sm text-gray-600">Supplier: {delivery.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">KES {delivery.cost.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </p>
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

export default Delivery;