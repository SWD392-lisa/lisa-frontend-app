import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Discover } from './pages/Discover';
import { Courses } from './pages/Courses';
import { StudentSupport } from './pages/StudentSupport';
import { Events } from './pages/Events';
import { LiveRoom } from './pages/LiveRoom';
import { Profile } from './pages/Profile';
import { Learning } from './pages/Learning';
import { Wallet } from './pages/Wallet';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Public Layout Routes */}
            <Route element={<MainLayout />}>
              <Route path="/discover" element={<Discover />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/support" element={<StudentSupport />} />
              <Route path="/events" element={<Events />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Home />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wallet" element={<Wallet />} />
              </Route>

              {/* Special Routes (No bottom nav) */}
              <Route path="/room/:id" element={<LiveRoom />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
