import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Route Guards
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import VolunteerRoute from './routes/VolunteerRoute';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import DonationRequestsPage from './pages/public/DonationRequestsPage';
import SearchPage from './pages/public/SearchPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Private Pages
import DonationDetailsPage from './pages/private/DonationDetailsPage';
import FundingPage from './pages/private/FundingPage';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import ProfilePage from './pages/dashboard/ProfilePage';
import MyDonationRequestsPage from './pages/dashboard/MyDonationRequestsPage';
import CreateDonationRequestPage from './pages/dashboard/CreateDonationRequestPage';
import EditDonationRequestPage from './pages/dashboard/EditDonationRequestPage';
import AllUsersPage from './pages/dashboard/AllUsersPage';
import AllDonationRequestsPage from './pages/dashboard/AllDonationRequestsPage';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid #334155',
            fontSize: '13px',
            borderRadius: '12px',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/donation-requests" element={<DonationRequestsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Standalone Routes */}
        <Route
          path="/donation-requests/:id"
          element={
            <PrivateRoute>
              <DonationDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/funding"
          element={
            <PrivateRoute>
              <FundingPage />
            </PrivateRoute>
          }
        />

        {/* Protected Dashboard Shell Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Donor specific */}
          <Route path="my-donation-requests" element={<MyDonationRequestsPage />} />
          <Route path="create-donation-request" element={<CreateDonationRequestPage />} />
          <Route path="edit-donation-request/:id" element={<EditDonationRequestPage />} />

          {/* Admin specific */}
          <Route
            path="all-users"
            element={
              <AdminRoute>
                <AllUsersPage />
              </AdminRoute>
            }
          />

          {/* Admin & Volunteer specific */}
          <Route
            path="all-blood-donation-request"
            element={
              <VolunteerRoute>
                <AllDonationRequestsPage />
              </VolunteerRoute>
            }
          />
        </Route>

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
