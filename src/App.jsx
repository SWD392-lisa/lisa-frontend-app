import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { CreatorRoute } from './components/layout/CreatorRoute';
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
import { LevelDetail } from './pages/LevelDetail';
import { SubLevelLearning } from './pages/SubLevelLearning';
import { LearnerProgress } from './pages/LearnerProgress';
import { Wallet } from './pages/Wallet';
import { MentorDashboard } from './pages/MentorDashboard';
import { MentorRoom } from './pages/MentorRoom';
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
import { NotFound } from './pages/NotFound';
import { ScrollToTop } from './components/layout/ScrollToTop';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';
import PaymentCancel from './pages/PaymentCancel';
import { CreatorDashboard } from './pages/creator/CreatorDashboard';
import { CreatorCurriculum } from './pages/creator/CreatorCurriculum';
import { CreatorRecordings } from './pages/creator/CreatorRecordings';
import { CreatorPodcasts } from './pages/creator/CreatorPodcasts';
import { CreatorUsers } from './pages/creator/CreatorUsers';
import './App.css';

// Component to handle root route
const RootRoute = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" replace /> : <Landing />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RootRoute />} />
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
                <Route path="/learning/levels/:levelId" element={<LevelDetail />} />
                <Route path="/learning/levels/:levelId/sublevels/:subLevelId" element={<SubLevelLearning />} />
                <Route path="/learning/progress" element={<LearnerProgress />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/error" element={<PaymentError />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
              </Route>

              {/* Special Routes (No bottom nav) */}
              <Route path="/room/:id" element={<LiveRoom />} />

              {/* Mentor LMS Routes */}
              <Route element={<MainLayout />}>
                <Route path="/mentor/dashboard" element={<MentorDashboard />} />
              </Route>
              <Route path="/mentor/room/:roomId" element={<MentorRoom />} />
            </Route>

            <Route element={<CreatorRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/creator" element={<CreatorDashboard />} />
                <Route path="/creator/curriculum" element={<CreatorCurriculum />} />
                <Route path="/creator/recordings" element={<CreatorRecordings />} />
                <Route path="/creator/podcasts" element={<CreatorPodcasts />} />
                <Route path="/creator/users" element={<CreatorUsers />} />
              </Route>
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
