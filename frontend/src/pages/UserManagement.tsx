import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  twoFaEnabled: boolean;
  lastLogin: string | null;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'reset'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'bookkeeper',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({ username: '', email: '', password: '', role: 'bookkeeper', isActive: true });
    setShowModal(true);
    setError('');
  };

  const handleEdit = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({ username: user.username, email: user.email, password: '', role: user.role, isActive: user.isActive });
    setShowModal(true);
    setError('');
  };

  const handleResetPassword = (user: User) => {
    setModalMode('reset');
    setSelectedUser(user);
    setFormData({ ...formData, password: '' });
    setShowModal(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (modalMode === 'create') {
        await axios.post(`${API_URL}/api/users`, formData, { headers });
        setSuccess('User created successfully');
      } else if (modalMode === 'edit') {
        await axios.put(`${API_URL}/api/users/${selectedUser?.id}`, {
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive
        }, { headers });
        setSuccess('User updated successfully');
      } else if (modalMode === 'reset') {
        await axios.put(`${API_URL}/api/users/${selectedUser?.id}/reset-password`, {
          newPassword: formData.password
        }, { headers });
        setSuccess('Password reset successfully');
      }

      setShowModal(false);
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User deleted successfully');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #e0e0e0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Sidebar />
      <div style={{ marginLeft: '256px' }}>
        <Navbar />
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>User Management</h1>
              <p style={{ color: '#718096', fontSize: '14px' }}>Manage system users and permissions</p>
            </div>
            <button onClick={handleCreate} style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)' }}>
              <span style={{ fontSize: '18px' }}>+</span> Add User
            </button>
          </div>

          {error && <div style={{ background: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}
          {success && <div style={{ background: '#d1fae5', borderLeft: '4px solid #10b981', color: '#065f46', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px' }}>{success}</div>}

          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Login</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '16px' }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{user.username}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#4b5563' }}>{user.email}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', fontSize: '12px', fontWeight: '500', borderRadius: '12px', background: '#eff6ff', color: '#1e40af' }}>{user.role}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 12px', fontSize: '12px', fontWeight: '500', borderRadius: '12px', background: user.isActive ? '#d1fae5' : '#fee2e2', color: user.isActive ? '#065f46' : '#991b1b' }}>
                        {user.isActive ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#6b7280' }}>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => handleEdit(user)} style={{ color: '#3b82f6', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                        <button onClick={() => handleResetPassword(user)} style={{ color: '#f59e0b', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Reset</button>
                        <button onClick={() => handleDelete(user.id)} style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: '#1a202c' }}>
              {modalMode === 'create' ? 'Create New User' : modalMode === 'edit' ? 'Edit User' : 'Reset Password'}
            </h2>
            
            {error && <div style={{ background: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#991b1b', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              {modalMode === 'create' && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Username</label>
                    <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} required />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} required />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Password</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} required minLength={8} />
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Role</label>
                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="bookkeeper">Bookkeeper</option>
                      <option value="attendant">Attendant</option>
                      <option value="accountant">Accountant</option>
                    </select>
                  </div>
                </>
              )}

              {modalMode === 'edit' && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} required />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Role</label>
                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="bookkeeper">Bookkeeper</option>
                      <option value="attendant">Attendant</option>
                      <option value="accountant">Accountant</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Active</span>
                    </label>
                  </div>
                </>
              )}

              {modalMode === 'reset' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>New Password</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }} required minLength={8} />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char</p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: 'white', color: '#374151' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                  {modalMode === 'create' ? 'Create User' : modalMode === 'edit' ? 'Update User' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
