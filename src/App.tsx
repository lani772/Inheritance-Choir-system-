import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Attendance from './pages/Attendance';
import Contributions from './pages/Contributions';
import Events from './pages/Events';
import Messages from './pages/Messages';
import Posts from './pages/Posts';
import Welfare from './pages/Welfare';
import Songs from './pages/Songs';
import Tasks from './pages/Tasks';
import Admin from './pages/Admin';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Simple auth wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="contributions" element={<Contributions />} />
          <Route path="events" element={<Events />} />
          <Route path="messages" element={<Messages />} />
          <Route path="posts" element={<Posts />} />
          <Route path="welfare" element={<Welfare />} />
          <Route path="songs" element={<Songs />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="admin" element={<Admin />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
