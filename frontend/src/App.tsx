import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ShiftReport from './pages/ShiftReport';
import Delivery from './pages/Delivery';
import Credit from './pages/Credit';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/shift-report" element={
            <ProtectedRoute>
              <Layout>
                <ShiftReport />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/delivery" element={
            <ProtectedRoute>
              <Layout>
                <Delivery />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/credit" element={
            <ProtectedRoute>
              <Layout>
                <Credit />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/expenses" element={
            <ProtectedRoute>
              <Layout>
                <Expenses />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
