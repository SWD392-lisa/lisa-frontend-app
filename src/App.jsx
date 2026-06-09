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
import { HelpCenter } from './pages/HelpCenter';
import { UpcomingEvents } from './pages/UpcomingEvents';
import { LiveRoom } from './pages/LiveRoom';
import { Profile } from './pages/Profile';
import { Learning } from './pages/Learning';
import { Wallet } from './pages/Wallet';
import { Introduction } from './pages/Introduction';
import { Vision } from './pages/Vision';
import { Team } from './pages/Team';
import { ContactUs } from './pages/ContactUs';
import { FeaturedMentors } from './pages/FeaturedMentors';
import { ExclusivePodcasts } from './pages/ExclusivePodcasts';
import { CommunityGuidelines } from './pages/CommunityGuidelines';
import { ReportViolation } from './pages/ReportViolation';
import { ForMentors } from './pages/ForMentors';
import { DownloadApp } from './pages/DownloadApp';
import { ScrollToTop } from './components/layout/ScrollToTop';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
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
              <Route path="/support" element={<HelpCenter />} />
              <Route path="/support/guidelines" element={<CommunityGuidelines />} />
              <Route path="/support/report" element={<ReportViolation />} />
              <Route path="/events" element={<UpcomingEvents />} />
              <Route path="/events/podcasts" element={<ExclusivePodcasts />} />
              <Route path="/discover/mentors" element={<FeaturedMentors />} />
              <Route path="/about" element={<Introduction />} />
              <Route path="/about/vision" element={<Vision />} />
              <Route path="/about/team" element={<Team />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/mentors/apply" element={<ForMentors />} />
              <Route path="/app" element={<DownloadApp />} />
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
