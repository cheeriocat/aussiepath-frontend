import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Customer pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Eligibility from './pages/Eligibility';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin layouts & pages
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminApplications from './admin/pages/Applications';
import AdminDocuments from './admin/pages/Documents';
import AdminJobs from './admin/pages/JobsAdmin';
import AdminSettings from './admin/pages/Settings';

// Layout wrapper for customer portal (includes header/footer)
const CustomerLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<Jobs />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
